

'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { AlertTriangle, Package, Plus, X, Loader2, TrendingUp, Box, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';

interface InventoryItem {
  productId: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  isLowStock: boolean;
  batches: any[];
}

export default function InventoryPage() {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    costPrice: '',
    expiryDate: '',
    type: 'purchase',
  });
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, productsRes] = await Promise.all([
        api.getInventorySummary(),
        api.getProducts({ limit: 100 }),
      ]);
      setSummary(summaryRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load inventory' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.adjustInventory(formData);
      setMessage({ type: 'success', text: 'Inventory adjusted successfully' });
      setFormData({
        productId: '',
        quantity: '',
        costPrice: '',
        expiryDate: '',
        type: 'purchase',
      });
      setShowForm(false);
      fetchData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to adjust inventory' });
    } finally {
      setFormLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-32" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  const lowStockItems = summary?.lowStockProducts || [];
  const allItems = summary?.summary || [];
  const totalProducts = allItems.length;
  const lowStockCount = lowStockItems.length;
  const healthyStockCount = totalProducts - lowStockCount;

  return (
    <ProtectedLayout>
      <div className="w-full min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Inventory Management</h1>
                  <p className="text-slate-600 dark:text-slate-400">Track and manage your stock levels efficiently</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> 
              Add Stock
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Products</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{totalProducts}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                    <Box className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Healthy Stock</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{healthyStockCount}</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Low Stock</p>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">{lowStockCount}</p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Messages */}
          {message && (
            <Alert 
              className={`border-l-4 ${
                message.type === 'error' 
                  ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                  : 'border-green-500 bg-green-50 dark:bg-green-950/20'
              }`}
            >
              <AlertDescription className={
                message.type === 'error' 
                  ? 'text-red-800 dark:text-red-200' 
                  : 'text-green-800 dark:text-green-200'
              }>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Low Stock Alert */}
          {lowStockItems.length > 0 && (
            <Card className="border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100">Low Stock Alert</h3>
                      <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
                        {lowStockItems.length} items
                      </Badge>
                    </div>
                    <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
                      The following products are below minimum stock level and need attention:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {lowStockItems.map((item: any) => (
                        <div key={item.productId} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span className="text-orange-600 dark:text-orange-400 font-semibold">
                              Stock: {item.currentStock}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">
                              Min: {item.minStock}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Stock Form */}
          {showForm && (
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">
                  Add Stock to Inventory
                </CardTitle>
                <button 
                  onClick={() => setShowForm(false)} 
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Product</label>
                      <select
                        value={formData.productId}
                        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Select a product</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name} ({p.sku})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity</label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        required
                        className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cost Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.costPrice}
                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                        required
                        className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Expiry Date (Optional)</label>
                      <Input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="submit" 
                      disabled={formLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                    >
                      {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      Add to Stock
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl px-6 py-2.5 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Inventory Table */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  Current Inventory
                  <span className="text-sm font-normal text-slate-600 dark:text-slate-400 ml-2">
                    ({allItems.length} products)
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allItems.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 text-lg">No inventory items found</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                    Start by adding your first product to inventory
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Product</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">SKU</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Current Stock</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Min Stock</TableHead>
                        <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Latest Batch</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allItems.map((item: InventoryItem, idx: number) => (
                        <TableRow 
                          key={idx} 
                          className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                        >
                          <TableCell className="font-medium text-slate-900 dark:text-white">
                            {item.name}
                          </TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400 font-mono text-sm">
                            {item.sku}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {item.currentStock}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-slate-600 dark:text-slate-400">
                            {item.minStock}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant={item.isLowStock ? "destructive" : "default"}
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.isLowStock
                                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
                                  : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
                              }`}
                            >
                              {item.isLowStock ? (
                                <>
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Low Stock
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  In Stock
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {item.batches && item.batches[0]?.expiryDate ? (
                              <div className="space-y-1">
                                <div className="text-slate-900 dark:text-white font-medium">
                                  Exp: {new Date(item.batches[0].expiryDate).toLocaleDateString()}
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 text-xs">
                                  Qty: {item.batches[0].quantity}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500 italic">No batches</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
}