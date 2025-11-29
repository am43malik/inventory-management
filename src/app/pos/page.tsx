
'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { Trash2, Plus, ShoppingCart, Search, Loader2, Receipt, DollarSign, Zap, Package, Calculator, CreditCard, DollarSign as Money, FileText, TrendingUp } from 'lucide-react';

interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  salePrice: number;
  costPrice: number;
}

export default function POSPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [taxPercentage, setTaxPercentage] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const res = await api.getProducts({ limit: 100 });
      setProducts(res.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setProductsLoading(false);
    }
  };

  const addToCart = (product: any, quantity: number) => {
    if (quantity <= 0) return;
    const existingItem = cart.find((item) => item.productId === product._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          productName: product.name,
          sku: product.sku,
          quantity,
          salePrice: product.salePrice,
          costPrice: product.costPrice,
        },
      ]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.salePrice, 0);
  const taxAmount = subtotal * (parseFloat(taxPercentage) / 100);
  const discountAmount = parseFloat(discount || '0');
  const total = Math.max(0, subtotal + taxAmount - discountAmount);
  const costTotal = cart.reduce((sum, item) => sum + item.quantity * item.costPrice, 0);
  const profit = subtotal - costTotal - discountAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Cart is empty' });
      return;
    }

    setIsProcessing(true);
    try {
      await api.createSale({
        items: cart,
        taxPercentage: parseFloat(taxPercentage),
        discount: discountAmount,
        paymentMethod,
      });

      setMessage({ type: 'success', text: 'Sale completed successfully!' });
      setCart([]);
      setTaxPercentage('0');
      setDiscount('0');
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to process sale',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Point of Sale</h1>
                    <p className="text-slate-600 dark:text-slate-400">Quick and efficient sales processing</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Live POS System</span>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <Alert className={`border-l-4 ${
                message.type === 'error' 
                  ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                  : 'border-green-500 bg-green-50 dark:bg-green-950/20'
              } rounded-xl`}>
                <AlertDescription className={
                  message.type === 'error' 
                    ? 'text-red-800 dark:text-red-200' 
                    : 'text-green-800 dark:text-green-200'
                }>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Search Bar */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Available Products
                  <span className="text-sm font-normal text-slate-600 dark:text-slate-400 ml-2">
                    ({filteredProducts.length} products)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4 animate-pulse space-y-3">
                        <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                        <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      No Products Found
                    </h3>
                    <p className="text-slate-500 dark:text-slate-500">
                      Try adjusting your search terms
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onAdd={(qty) => addToCart(product, qty)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cart Section */}
          <div className="space-y-6 lg:sticky lg:top-6 h-fit">
            {/* Cart Card */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    Shopping Cart
                    <span className="text-sm font-normal text-slate-600 dark:text-slate-400 ml-2">
                      ({cart.length} items)
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Cart is Empty
                    </h3>
                    <p className="text-slate-500 dark:text-slate-500">
                      Add products to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-4 space-y-3 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 dark:text-white">{item.productName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                {item.sku}
                              </Badge>
                            </div>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-2">
                              ₹${item.salePrice.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex gap-3 items-center justify-between">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.productId,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-20 text-center bg-white dark:bg-slate-600 border-2 border-slate-200 dark:border-slate-500 rounded-lg"
                          />
                          <p className="text-lg font-bold text-slate-900 dark:text-white flex-1 text-right">
                            ${(item.quantity * item.salePrice).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Billing Card */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Calculator className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary */}
                <div className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Tax Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tax (%)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={taxPercentage}
                      onChange={(e) => setTaxPercentage(e.target.value)}
                      className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                    />
                    <div className="flex items-center px-4 bg-blue-100 dark:bg-blue-900 rounded-xl font-semibold text-sm min-w-20 justify-center text-blue-700 dark:text-blue-300">
                      ${taxAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Discount Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Discount ($)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                    />
                    <div className="flex items-center px-4 bg-red-100 dark:bg-red-900 rounded-xl font-semibold text-sm min-w-20 justify-center text-red-700 dark:text-red-300">
                      -${discountAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Profit Info */}
                {cart.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-green-700 dark:text-green-300 font-semibold">ESTIMATED PROFIT</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">${profit.toFixed(2)}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">TOTAL AMOUNT</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </p>
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'cash', icon: DollarSign, label: 'Cash', color: 'green' },
                      { value: 'card', icon: CreditCard, label: 'Card', color: 'blue' },
                      { value: 'cheque', icon: FileText, label: 'Cheque', color: 'yellow' },
                      { value: 'other', icon: DollarSign, label: 'Other', color: 'gray' },
                    ].map((method) => (
                      <button
                        key={method.value}
                        onClick={() => setPaymentMethod(method.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                          paymentMethod === method.value
                            ? `border-${method.color}-500 bg-${method.color}-50 dark:bg-${method.color}-900/20`
                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <method.icon className={`w-5 h-5 ${
                          paymentMethod === method.value 
                            ? `text-${method.color}-600 dark:text-${method.color}-400`
                            : 'text-slate-500'
                        }`} />
                        <span className={`text-xs font-medium ${
                          paymentMethod === method.value
                            ? `text-${method.color}-700 dark:text-${method.color}-300`
                            : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {method.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing || cart.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:hover:shadow-lg disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Sale...
                    </>
                  ) : (
                    <>
                      <Receipt className="w-5 h-5 mr-2" />
                      Complete Sale - ₹${total.toFixed(2)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: any;
  onAdd: (qty: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              {product.sku}
            </Badge>
            <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300">
              {product.unit}
            </Badge>
          </div>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-3">
            $${product.salePrice.toFixed(2)}
          </p>
          {product.currentStock && (
            <p className={`text-xs mt-1 ${
              product.currentStock > 10 
                ? 'text-green-600 dark:text-green-400' 
                : product.currentStock > 0
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              Stock: {product.currentStock}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Input
            type="number"
            min="1"
            max={product.currentStock || 999}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-20 text-center bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-lg focus:border-blue-500"
          />
          <Button
            onClick={() => {
              onAdd(quantity);
              setQuantity(1);
            }}
            disabled={product.currentStock === 0}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}