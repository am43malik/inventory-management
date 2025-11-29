// 'use client';

// import { ProtectedLayout } from '@/components/ProtectedLayout';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
// import { Alert, AlertDescription } from '@/components/ui/Alert';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
// import { useEffect, useState } from 'react';
// import { api } from '@/lib/api-client';
// import { Plus, Edit2, Trash2, Package, Loader2, X } from 'lucide-react';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { StockInModal, StockOutModal } from '@/components/StockActions';

// interface Batch {
//   batchNumber: string;
//   quantity: number;
//   expiryDate?: Date;
//   costPrice: number;
//   createdAt: Date;
// }

// interface Product {
//   _id: string;
//   name: string;
//   sku: string;
//   category: string;
//   costPrice: number;
//   salePrice: number;
//   unit: string;
//   minStock: number;
//   batches?: Batch[];
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     sku: '',
//     category: '',
//     description: '',
//     costPrice: '',
//     salePrice: '',
//     unit: 'pcs',
//     minStock: '10',
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [productsRes, categoriesRes] = await Promise.all([
//         api.getProducts(),
//         api.getCategories(),
//       ]);
//       setProducts(productsRes.data.data);
//       setCategories(categoriesRes.data.data);
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to load products' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setFormLoading(true);
//     try {
//       if (editingId) {
//         await api.updateProduct(editingId, formData);
//         setMessage({ type: 'success', text: 'Product updated successfully' });
//       } else {
//         await api.createProduct(formData);
//         setMessage({ type: 'success', text: 'Product created successfully' });
//       }
//       setFormData({
//         name: '',
//         sku: '',
//         category: '',
//         description: '',
//         costPrice: '',
//         salePrice: '',
//         unit: 'pcs',
//         minStock: '10',
//       });
//       setShowForm(false);
//       setEditingId(null);
//       fetchData();
//     } catch (error: any) {
//       setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to save product' });
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setFormData({
//       name: product.name,
//       sku: product.sku,
//       category: product.category,
//       description: '',
//       costPrice: product.costPrice.toString(),
//       salePrice: product.salePrice.toString(),
//       unit: product.unit,
//       minStock: product.minStock.toString(),
//     });
//     setEditingId(product._id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;
//     try {
//       await api.deleteProduct(id);
//       setMessage({ type: 'success', text: 'Product deleted successfully' });
//       fetchData();
//     } catch (error: any) {
//       setMessage({ type: 'error', text: 'Failed to delete product' });
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       sku: '',
//       category: '',
//       description: '',
//       costPrice: '',
//       salePrice: '',
//       unit: 'pcs',
//       minStock: '10',
//     });
//     setShowForm(false);
//     setEditingId(null);
//   };

//   return (
//     <ProtectedLayout>
//       <div className="w-full space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">Products</h1>
//             <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your product inventory</p>
//           </div>
//           <Button 
//             onClick={() => setShowForm(!showForm)}
//             className="bg-linear-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white"
//           >
//             <Plus className="w-4 h-4 mr-2" /> 
//             New Product
//           </Button>
//         </div>

//         {/* Messages */}
//         {message && (
//           <Alert type={message.type === 'error' ? 'destructive' : 'success'} className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
//             <AlertDescription className={message.type === 'error' ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}>
//               {message.text}
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Form Card */}
//         {showForm && (
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0">
//               <CardTitle>{editingId ? 'Edit Product' : 'Create New Product'}</CardTitle>
//               <button onClick={resetForm} className="text-slate-500 hover:text-slate-700">
//                 <X className="w-5 h-5" />
//               </button>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Product Name</label>
//                     <Input
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       placeholder="Enter product name"
//                       required
//                       className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">SKU</label>
//                     <Input
//                       value={formData.sku}
//                       onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
//                       placeholder="SKU-001"
//                       required
//                       className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex justify-between items-center">
//                       <label className="text-sm font-medium">Category</label>
//                       <a href="/categories" target="_blank" className="text-purple-600 hover:text-purple-700 text-xs font-semibold">+ Manage Categories</a>
//                     </div>
//                     <select
//                       value={formData.category}
//                       onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                       className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       required
//                     >
//                       <option value="">Select a category</option>
//                       {categories.map((c) => (
//                         <option key={c._id} value={c._id}>{c.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Unit</label>
//                     <Input
//                       value={formData.unit}
//                       onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
//                       placeholder="pcs, kg, etc."
//                       className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Cost Price</label>
//                     <Input
//                       type="number"
//                       step="0.01"
//                       value={formData.costPrice}
//                       onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
//                       placeholder="0.00"
//                       required
//                       className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Sale Price</label>
//                     <Input
//                       type="number"
//                       step="0.01"
//                       value={formData.salePrice}
//                       onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
//                       placeholder="0.00"
//                       required
//                       className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Minimum Stock</label>
//                     <Input
//                       type="number"
//                       value={formData.minStock}
//                       onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
//                       placeholder="10"
//                       className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <Button 
//                     type="submit" 
//                     disabled={formLoading}
//                     className="bg-linear-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white"
//                   >
//                     {formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//                     {editingId ? 'Update Product' : 'Create Product'}
//                   </Button>
//                   <Button 
//                     type="button"
//                     variant="outline"
//                     onClick={resetForm}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         )}

//         {/* Products Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Package className="w-5 h-5 text-purple-500" />
//               Products List
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="space-y-2">
//                 {[...Array(5)].map((_, i) => (
//                   <Skeleton key={i} className="h-12" />
//                 ))}
//               </div>
//             ) : products.length === 0 ? (
//               <div className="text-center py-12">
//                 <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
//                 <p className="text-slate-500">No products found. Create your first product!</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Name</TableHead>
//                       <TableHead>SKU</TableHead>
//                       <TableHead className="text-center">Stock</TableHead>
//                       <TableHead>Cost Price</TableHead>
//                       <TableHead>Sale Price</TableHead>
//                       <TableHead>Margin</TableHead>
//                       <TableHead>Unit</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {products.map((product) => {
//                       const currentStock = product.batches?.reduce(
//                         (sum: number, batch: Batch) => sum + batch.quantity,
//                         0
//                       ) || 0;
//                       const margin = product.salePrice > 0 
//                         ? (((product.salePrice - product.costPrice) / product.salePrice) * 100).toFixed(1)
//                         : '0';
//                       const isLowStock = currentStock <= product.minStock;
                      
//                       return (
//                         <TableRow key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
//                           <TableCell className="font-medium">{product.name}</TableCell>
//                           <TableCell className="text-slate-600 dark:text-slate-400">{product.sku}</TableCell>
//                           <TableCell className="text-center">
//                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                               isLowStock 
//                                 ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200' 
//                                 : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200'
//                             }`}>
//                               {currentStock}
//                             </span>
//                           </TableCell>
//                           <TableCell>${product.costPrice.toFixed(2)}</TableCell>
//                           <TableCell className="font-semibold">${product.salePrice.toFixed(2)}</TableCell>
//                           <TableCell>
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200">
//                               {margin}%
//                             </span>
//                           </TableCell>
//                           <TableCell>{product.unit}</TableCell>
//                           <TableCell className="text-right">
//                             <div className="flex justify-end gap-2 flex-wrap">
//                               <StockInModal 
//                                 productId={product._id}
//                                 productName={product.name}
//                                 currentStock={currentStock}
//                                 onSuccess={() => fetchData()}
//                               />
//                               <StockOutModal 
//                                 productId={product._id}
//                                 productName={product.name}
//                                 currentStock={currentStock}
//                                 onSuccess={() => fetchData()}
//                               />
//                               <button 
//                                 onClick={() => handleEdit(product)} 
//                                 className="p-1 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 rounded"
//                               >
//                                 <Edit2 className="w-4 h-4" />
//                               </button>
//                               <button 
//                                 onClick={() => handleDelete(product._id)} 
//                                 className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </ProtectedLayout>
//   );
// }


'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { Plus, Edit2, Trash2, Package, Loader2, X, Tag, DollarSign, TrendingUp, Box, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { StockInModal, StockOutModal } from '@/components/StockActions';

interface Batch {
  batchNumber: string;
  quantity: number;
  expiryDate?: Date;
  costPrice: number;
  createdAt: Date;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  costPrice: number;
  salePrice: number;
  unit: string;
  minStock: number;
  batches?: Batch[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    costPrice: '',
    salePrice: '',
    unit: 'pcs',
    minStock: '10',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(productsRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingId) {
        await api.updateProduct(editingId, formData);
        setMessage({ type: 'success', text: 'Product updated successfully' });
      } else {
        await api.createProduct(formData);
        setMessage({ type: 'success', text: 'Product created successfully' });
      }
      setFormData({
        name: '',
        sku: '',
        category: '',
        description: '',
        costPrice: '',
        salePrice: '',
        unit: 'pcs',
        minStock: '10',
      });
      setShowForm(false);
      setEditingId(null);
      fetchData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to save product' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      description: '',
      costPrice: product.costPrice.toString(),
      salePrice: product.salePrice.toString(),
      unit: product.unit,
      minStock: product.minStock.toString(),
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      setMessage({ type: 'success', text: 'Product deleted successfully' });
      fetchData();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to delete product' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: '',
      description: '',
      costPrice: '',
      salePrice: '',
      unit: 'pcs',
      minStock: '10',
    });
    setShowForm(false);
    setEditingId(null);
  };

  // Calculate summary statistics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(product => {
    const currentStock = product.batches?.reduce((sum: number, batch: Batch) => sum + batch.quantity, 0) || 0;
    return currentStock <= product.minStock;
  }).length;
  const totalValue = products.reduce((sum, product) => {
    const currentStock = product.batches?.reduce((sum: number, batch: Batch) => sum + batch.quantity, 0) || 0;
    return sum + (currentStock * product.costPrice);
  }, 0);

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Product Management</h1>
                  <p className="text-slate-600 dark:text-slate-400">Manage your product catalog and inventory</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> 
              New Product
            </Button>
          </div>

          {/* Summary Cards */}
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
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Low Stock</p>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">{lowStockProducts}</p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Inventory Value</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">${totalValue.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
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

          {/* Form Card */}
          {showForm && (
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-600" />
                  {editingId ? 'Edit Product' : 'Create New Product'}
                </CardTitle>
                <button 
                  onClick={resetForm} 
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Product Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter product name"
                        required
                        className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">SKU Code</label>
                      <Input
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="SKU-001"
                        required
                        className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
                        <a href="/categories" target="_blank" className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Manage Categories
                        </a>
                      </div>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unit</label>
                      <Input
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="pcs, kg, etc."
                        className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cost Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                        placeholder="0.00"
                        required
                        className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sale Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.salePrice}
                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                        placeholder="0.00"
                        required
                        className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Minimum Stock</label>
                      <Input
                        type="number"
                        value={formData.minStock}
                        onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                        placeholder="10"
                        className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit" 
                      disabled={formLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                    >
                      {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {editingId ? 'Update Product' : 'Create Product'}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl px-6 py-2.5 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Products Table */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  Product Catalog
                  <span className="text-sm font-normal text-slate-600 dark:text-slate-400 ml-2">
                    ({products.length} products)
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 flex-1" />
                      <Skeleton className="h-12 flex-1" />
                      <Skeleton className="h-12 flex-1" />
                      <Skeleton className="h-12 flex-1" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500 mb-4">
                    Get started by creating your first product
                  </p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Product
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Product</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">SKU</TableHead>
                        <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">Stock Level</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Cost</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Price</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Margin</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => {
                        const currentStock = product.batches?.reduce(
                          (sum: number, batch: Batch) => sum + batch.quantity,
                          0
                        ) || 0;
                        const margin = product.salePrice > 0 
                          ? (((product.salePrice - product.costPrice) / product.salePrice) * 100).toFixed(1)
                          : '0';
                        const isLowStock = currentStock <= product.minStock;
                        
                        return (
                          <TableRow 
                            key={product._id} 
                            className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                          >
                            <TableCell>
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{product.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{product.unit}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-600 dark:text-slate-400 font-mono text-sm">
                              {product.sku}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge 
                                variant={isLowStock ? "destructive" : "default"}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                                  isLowStock 
                                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
                                    : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
                                }`}
                              >
                                {isLowStock ? (
                                  <>
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    {currentStock}
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    {currentStock}
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-600 dark:text-slate-400">
                              ${product.costPrice.toFixed(2)}
                            </TableCell>
                            <TableCell className="font-semibold text-slate-900 dark:text-white">
                              ${product.salePrice.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full text-xs font-semibold">
                                {margin}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2 flex-wrap">
                                <StockInModal 
                                  productId={product._id}
                                  productName={product.name}
                                  currentStock={currentStock}
                                  onSuccess={() => fetchData()}
                                />
                                <StockOutModal 
                                  productId={product._id}
                                  productName={product.name}
                                  currentStock={currentStock}
                                  onSuccess={() => fetchData()}
                                />
                                <button 
                                  onClick={() => handleEdit(product)} 
                                  className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(product._id)} 
                                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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