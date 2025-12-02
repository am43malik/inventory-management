'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api-client';
import {
  Plus,
  Search,
  Trash2,
  Loader2,
  X,
  ShoppingBag,
  Check,
  Minus,
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  sku: string;
  salePrice: number;
  costPrice?: number;
  currentStock?: number;
  unit?: string;
}

interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  salePrice: number;
  costPrice?: number;
}

/* Helper to format INR */
const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);

export default function POSListPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [discount, setDiscount] = useState('0'); // discount amount in ₹
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setDisplayProducts(allProducts);
      return;
    }
    setDisplayProducts(
      allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.sku.toLowerCase() === q,
      ),
    );
  }, [query, allProducts]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await api.getProducts({ limit: 1000 });
      setAllProducts(res.data.data || []);
      setDisplayProducts(res.data.data || []);
    } catch (err) {
      console.error('failed to fetch products', err);
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  }

  function addToCart(product: Product, qty = 1) {
    if (product.currentStock !== undefined && product.currentStock <= 0) {
      setMessage({ type: 'error', text: 'Product out of stock' });
      return;
    }
    setCart((prev) => {
      const exists = prev.find((p) => p.productId === product._id);
      if (exists) {
        return prev.map((p) =>
          p.productId === product._id ? { ...p, quantity: p.quantity + qty } : p,
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          productName: product.name,
          sku: product.sku,
          quantity: qty,
          salePrice: product.salePrice,
          costPrice: product.costPrice,
        },
      ];
    });
    searchRef.current?.focus();
    setMessage(null);
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((p) => p.productId !== productId));
  }

  function changeQty(productId: string, qty: number) {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((p) => (p.productId === productId ? { ...p, quantity: qty } : p)));
  }

  const subtotal = cart.reduce((s, it) => s + it.quantity * it.salePrice, 0);
  const totalItems = cart.reduce((s, it) => s + it.quantity, 0);

  const discountAmount = Math.max(0, Number.parseFloat(discount || '0') || 0);
  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);

  async function checkout() {
    if (!cart.length) {
      setMessage({ type: 'error', text: 'Cart is empty' });
      return;
    }
    setProcessing(true);
    try {
      await api.createSale({
        items: cart,
        taxPercentage: 0,
        discount: discountAmount,
        paymentMethod: 'cash',
      });
      setCart([]);
      setDiscount('0');
      setMessage({ type: 'success', text: 'Sale completed' });
    } catch (err) {
      console.error('checkout failed', err);
      setMessage({ type: 'error', text: 'Failed to complete sale' });
    } finally {
      setProcessing(false);
    }
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-6">
          {/* LEFT: Search + List */}
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type product name or SKU..."
                  className="pl-12 h-14 rounded-2xl text-lg shadow-sm"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                    aria-label="clear"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {loading ? 'Loading products...' : `${displayProducts.length} products`}
              </p>
            </div>

            {/* optional message */}
            {message && (
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardContent>
                  <Alert className={`border-l-4 ${message.type === 'error' ? 'border-red-500' : 'border-green-500'} rounded-xl`}>
                    <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                      {message.text}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {/* List header */}
            <div className="flex items-center gap-3 text-sm text-slate-600 font-medium uppercase">
              <ShoppingBag className="w-4 h-4" />
              <span>{query ? 'Search results' : 'All products'}</span>
            </div>

            {/* Product list (list format) */}
            <div className="overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              {loading ? (
                <div className="p-6 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : displayProducts.length === 0 ? (
                <div className="p-6 text-center text-slate-500">No products found</div>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                  {displayProducts.map((p) => {
                    const inCartQty = cart.find((c) => c.productId === p._id)?.quantity || 0;
                    const outOfStock = p.currentStock !== undefined && p.currentStock <= 0;
                    return (
                      <li
                        key={p._id}
                        className={`flex items-center gap-4 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                          inCartQty ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        {/* SKU */}
                        <div className="w-24 flex-shrink-0">
                          <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs font-mono rounded">
                            {p.sku}
                          </span>
                        </div>

                        {/* name */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <p className="font-medium text-slate-800 dark:text-white truncate">{p.name}</p>
                            <div className="flex items-center gap-3">
                              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {formatINR(p.salePrice)}
                              </div>
                              {inCartQty > 0 && (
                                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                                  {inCartQty}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                            <span>{p.unit || 'pcs'}</span>
                            <span>•</span>
                            <span>
                              {p.currentStock === undefined ? '—' : `${p.currentStock} in stock`}
                            </span>
                            {outOfStock && <span className="text-red-500 ml-2 font-medium">Out of stock</span>}
                          </div>
                        </div>

                        {/* add button */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => addToCart(p, 1)}
                            disabled={outOfStock}
                            className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition ${
                              outOfStock
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-white border border-slate-200 hover:bg-blue-50 text-slate-700'
                            }`}
                            title={outOfStock ? 'Out of stock' : 'Add to cart'}
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* RIGHT: two stacked cards — Cart (top) and Order Summary (bottom) */}
          <div className="flex flex-col gap-4">
            {/* Shopping Cart card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Shopping Cart</h3>
                    <p className="text-sm text-slate-500">{totalItems} items</p>
                  </div>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-xl"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="h-44 flex flex-col items-center justify-center text-slate-400">
                    <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                    <p className="font-semibold">Cart is empty</p>
                    <p className="text-sm">Tap products to add</p>
                  </div>
                ) : (
                  cart.map((c) => (
                    <div key={c.productId} className="bg-slate-50 dark:bg-slate-700/40 rounded-2xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-3">
                          <p className="font-semibold text-slate-800 dark:text-white leading-tight">{c.productName}</p>
                          <p className="text-sm text-slate-500 mt-1">{formatINR(c.salePrice)} each</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(c.productId)}
                          className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-600 rounded-xl p-1">
                          <button
                            onClick={() => changeQty(c.productId, c.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-500 hover:bg-slate-200 dark:hover:bg-slate-400"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <input
                            type="number"
                            value={c.quantity}
                            onChange={(e) => changeQty(c.productId, Number.parseInt(e.target.value) || 0)}
                            className="w-16 text-center font-bold text-lg bg-transparent border-0 focus:ring-0"
                          />
                          <button
                            onClick={() => changeQty(c.productId, c.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-500 hover:bg-slate-200 dark:hover:bg-slate-400"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="text-xl font-bold text-slate-800 dark:text-white">
                          {formatINR(c.quantity * c.salePrice)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Order Summary card with Discount field */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800 dark:text-white">Order Summary</h3>
                <p className="text-sm text-slate-500">{cart.length} line(s)</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Subtotal</span>
                  <span className="font-semibold">{formatINR(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Tax</span>
                  <span className="font-semibold">{formatINR(0)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Discount (₹)</span>
                  <div className="w-40">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Discount applied</span>
                  <span className="font-semibold">-{formatINR(discountAmount)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Total</span>
                  <span className="text-2xl font-bold">{formatINR(totalAfterDiscount)}</span>
                </div>
              </div>

              <Button
                onClick={checkout}
                disabled={processing || cart.length === 0}
                className="w-full h-14 text-lg font-bold rounded-2xl bg-blue-600 hover:bg-blue-700"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" /> Complete Sale — {formatINR(totalAfterDiscount)}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
