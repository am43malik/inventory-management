'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { RotateCcw, Package, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Product {
  _id: string;
  id?: string;
  name: string;
  sku: string;
  costPrice: number;
  salePrice: number;
}

interface Sale {
  _id: string;
  id?: string;
  items: any[];
  total: number;
  createdAt: string;
}

export default function ReturnsPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSaleId, setSelectedSaleId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch sales and products on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [salesResp, productsResp] = await Promise.all([
          api.getSales({ limit: 100 }),
          api.getProducts({ limit: 200 })
        ]);
        
        setSales(salesResp.data?.data || []);
        setProducts(productsResp.data?.data || []);
      } catch (error) {
        console.error('Failed to load data:', error);
        setMessage({ type: 'error', text: 'Failed to load sales and products' });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Get selected product details
  const selectedProduct = products.find(p => p._id === selectedProductId || p.id === selectedProductId);
  const selectedSale = sales.find(s => s._id === selectedSaleId || s.id === selectedSaleId);

  // Validate form
  const isFormValid = selectedProductId && quantity > 0;

  const handleRecordReturn = async () => {
    if (!isFormValid || !selectedProduct) {
      setMessage({ type: 'error', text: 'Please select a product and enter a valid quantity' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const batchNumber = `RET-${Date.now()}`;
      const costPrice = selectedProduct.costPrice || 0;

      // Call adjust inventory with return type
      const response = await api.adjustInventory({
        productId: selectedProduct._id || selectedProduct.id,
        type: 'return',
        quantity,
        costPrice,
        batchNumber,
        reason: `Customer return - Product: ${selectedProduct.name}${selectedSaleId ? ` - Sale: ${selectedSaleId}` : ''}`,
      });

      if (response.data?.success) {
        setMessage({ 
          type: 'success', 
          text: `Return recorded successfully! ${quantity}x ${selectedProduct.name} restored to stock.` 
        });
        
        // Reset form
        setTimeout(() => {
          setSelectedSaleId('');
          setSelectedProductId('');
          setQuantity(1);
          setMessage(null);
        }, 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to record return. Please try again.' });
      }
    } catch (error: any) {
      console.error('Return recording error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to record return';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-48"></div>
              <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <RotateCcw className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Returns
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 ml-11">
              Record customer returns and restore stock quantities
            </p>
          </div>

          {/* Alert Messages */}
          {message && (
            <div className={`flex items-start gap-4 p-4 rounded-xl border-l-4 ${
              message.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${
                message.type === 'success' 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {message.text}
              </p>
            </div>
          )}

          {/* Main Form Card */}
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
              <CardTitle className="text-2xl font-semibold">Return Details</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Fill in the details below to record a return</p>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
              {/* Sale Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  <span className="flex items-center gap-2">
                    <span>Link to Sale Invoice</span>
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-400">Optional</span>
                  </span>
                </label>
                <Select value={selectedSaleId} onValueChange={setSelectedSaleId}>
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue placeholder="Select a sale invoice (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {sales.length === 0 ? (
                      <div className="p-2 text-sm text-slate-500">No sales found</div>
                    ) : (
                      sales.map((sale) => (
                        <SelectItem key={sale._id || sale.id} value={sale._id || sale.id || ''}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">{(sale._id || sale.id || '').substring(0, 8)}</span>
                            <span className="text-slate-600">₹{sale.total?.toFixed(2) || '0.00'}</span>
                            <span className="text-slate-400 text-xs">
                              {new Date(sale.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Product Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Select Product
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue placeholder="Choose a product to return" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.length === 0 ? (
                      <div className="p-2 text-sm text-slate-500">No products available</div>
                    ) : (
                      products.map((product) => (
                        <SelectItem key={product._id || product.id} value={product._id || product.id || ''}>
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{product.name}</span>
                            <span className="text-slate-500 text-xs">({product.sku})</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Product Details Display */}
              {selectedProduct && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Product</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">SKU</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">{selectedProduct.sku}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Cost Price</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">₹{selectedProduct.costPrice?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wide">Sale Price</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">₹{selectedProduct.salePrice?.toFixed(2) || '0.00'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <span>Returned Quantity</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={1}
                    max={999}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    placeholder="Enter quantity"
                    className="h-11 text-base flex-1"
                  />
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                    units
                  </div>
                </div>
              </div>

              {/* Return Summary */}
              {selectedProduct && quantity > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <span className="font-semibold">Summary:</span> Returning {quantity} × {selectedProduct.name}
                    {selectedProduct.costPrice && (
                      <span> (Total cost: ₹{(quantity * selectedProduct.costPrice).toFixed(2)})</span>
                    )}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setSelectedSaleId('');
                    setSelectedProductId('');
                    setQuantity(1);
                  }}
                  disabled={isSubmitting}
                >
                  Clear
                </Button>
                <Button
                  size="lg"
                  onClick={handleRecordReturn}
                  disabled={!isFormValid || isSubmitting}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? 'Recording Return...' : 'Record Return'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle>How Returns Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">1</span>
                <span><span className="font-semibold text-slate-900 dark:text-slate-100">Optional:</span> Link the return to a previous sale invoice for reference</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">2</span>
                <span><span className="font-semibold text-slate-900 dark:text-slate-100">Required:</span> Select the product being returned and specify the quantity</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">3</span>
                <span><span className="font-semibold text-slate-900 dark:text-slate-100">Automatic:</span> Stock quantity increases immediately and is reflected in inventory logs</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">4</span>
                <span><span className="font-semibold text-slate-900 dark:text-slate-100">Dashboard:</span> Return data appears in daily/period reports for the current range</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
}
