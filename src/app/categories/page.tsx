// 'use client';

// import { ProtectedLayout } from '@/components/ProtectedLayout';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Alert, AlertDescription } from '@/components/ui/Alert';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
// import { useEffect, useState } from 'react';
// import { api } from '@/lib/api-client';
// import { Plus, Edit2, Trash2, Tag, Loader2, X } from 'lucide-react';
// import { Skeleton } from '@/components/ui/Skeleton';

// interface Category {
//   _id: string;
//   name: string;
//   description?: string;
//   createdAt?: string;
// }

// export default function CategoriesPage() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//   });

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const res = await api.getCategories();
//       setCategories(res.data.data);
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to load categories' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.name.trim()) {
//       setMessage({ type: 'error', text: 'Category name is required' });
//       return;
//     }

//     setFormLoading(true);
//     try {
//       if (editingId) {
//         // Update category
//         await api.updateCategory(editingId, formData);
//         setMessage({ type: 'success', text: 'Category updated successfully' });
//       } else {
//         // Create new category
//         await api.createCategory(formData);
//         setMessage({ type: 'success', text: 'Category created successfully' });
//       }
//       setFormData({ name: '', description: '' });
//       setShowForm(false);
//       setEditingId(null);
//       fetchCategories();
//     } catch (error: any) {
//       setMessage({ 
//         type: 'error', 
//         text: error.response?.data?.error || 'Failed to save category' 
//       });
//     } finally {
//       setFormLoading(false);
//     }
//   };

//   const handleEdit = (category: Category) => {
//     setFormData({
//       name: category.name,
//       description: category.description || '',
//     });
//     setEditingId(category._id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('آپ یقینی ہیں کہ یہ category حذف کرنا چاہتے ہیں؟')) return;
//     try {
//       await api.deleteCategory(id);
//       setMessage({ type: 'success', text: 'Category deleted successfully' });
//       fetchCategories();
//     } catch (error: any) {
//       setMessage({ 
//         type: 'error', 
//         text: error.response?.data?.error || 'Failed to delete category' 
//       });
//     }
//   };

//   const resetForm = () => {
//     setFormData({ name: '', description: '' });
//     setShowForm(false);
//     setEditingId(null);
//   };

//   if (isLoading) {
//     return (
//       <ProtectedLayout>
//         <div className="space-y-6">
//           <Skeleton className="h-10 w-40" />
//           <div className="space-y-2">
//             {[...Array(5)].map((_, i) => (
//               <Skeleton key={i} className="h-12" />
//             ))}
//           </div>
//         </div>
//       </ProtectedLayout>
//     );
//   }

//   return (
//     <ProtectedLayout>
//       <div className="w-full space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
//               Categories
//             </h1>
//             <p className="text-slate-500 dark:text-slate-400 mt-2">Manage product categories</p>
//           </div>
//           <Button 
//             onClick={() => setShowForm(!showForm)}
//             className="bg-linear-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white"
//           >
//             <Plus className="w-4 h-4 mr-2" /> 
//             New Category
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
//               <CardTitle>{editingId ? 'Edit Category' : 'Create New Category'}</CardTitle>
//               <button onClick={resetForm} className="text-slate-500 hover:text-slate-700">
//                 <X className="w-5 h-5" />
//               </button>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Category Name *</label>
//                     <Input
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       placeholder="e.g., Electronics, Clothing, Food"
//                       required
//                       className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-sm font-medium">Description (Optional)</label>
//                     <textarea
//                       value={formData.description}
//                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                       placeholder="Enter category description..."
//                       rows={4}
//                       className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-slate-100"
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
//                     {editingId ? 'Update Category' : 'Create Category'}
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

//         {/* Categories Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Tag className="w-5 h-5 text-purple-500" />
//               Categories ({categories.length})
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {categories.length === 0 ? (
//               <div className="text-center py-12">
//                 <Tag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
//                 <p className="text-slate-500">No categories found. Create your first category!</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Name</TableHead>
//                       <TableHead>Description</TableHead>
//                       <TableHead>Created</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {categories.map((category) => (
//                       <TableRow key={category._id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
//                         <TableCell className="font-medium">{category.name}</TableCell>
//                         <TableCell className="text-slate-600 dark:text-slate-400 max-w-sm truncate">
//                           {category.description || '-'}
//                         </TableCell>
//                         <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
//                           {category.createdAt 
//                             ? new Date(category.createdAt).toLocaleDateString('ur-PK')
//                             : '-'
//                           }
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <div className="flex justify-end gap-2">
//                             <button 
//                               onClick={() => handleEdit(category)} 
//                               className="p-1 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 rounded"
//                             >
//                               <Edit2 className="w-4 h-4" />
//                             </button>
//                             <button 
//                               onClick={() => handleDelete(category._id)} 
//                               className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
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
import { Plus, Edit2, Trash2, Tag, Loader2, X, FolderOpen, Layers, Archive } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';

interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load categories' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Category name is required' });
      return;
    }

    setFormLoading(true);
    try {
      if (editingId) {
        await api.updateCategory(editingId, formData);
        setMessage({ type: 'success', text: 'Category updated successfully' });
      } else {
        await api.createCategory(formData);
        setMessage({ type: 'success', text: 'Category created successfully' });
      }
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditingId(null);
      fetchCategories();
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to save category' 
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.deleteCategory(id);
      setMessage({ type: 'success', text: 'Category deleted successfully' });
      fetchCategories();
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to delete category' 
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setShowForm(false);
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-10 w-40" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <FolderOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Category Management</h1>
                  <p className="text-slate-600 dark:text-slate-400">Organize your products with categories</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> 
              New Category
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Categories</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{categories.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                    <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Categories</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{categories.length}</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                    <Tag className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Latest Addition</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white mt-2">
                      {categories.length > 0 
                        ? new Date(categories[categories.length - 1].createdAt!).toLocaleDateString()
                        : 'No categories'
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                    <Archive className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                  {editingId ? 'Edit Category' : 'Create New Category'}
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
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-blue-500" />
                        Category Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Electronics, Clothing, Food"
                        required
                        className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Archive className="w-4 h-4 text-blue-500" />
                        Description (Optional)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter category description..."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-slate-900 dark:text-white placeholder-slate-500 transition-all duration-200 resize-none"
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
                      {editingId ? 'Update Category' : 'Create Category'}
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

          {/* Categories Table */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  Category List
                  <span className="text-sm font-normal text-slate-600 dark:text-slate-400 ml-2">
                    ({categories.length} categories)
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    No Categories Found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500 mb-4">
                    Get started by creating your first category
                  </p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Category
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Category Name</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Description</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Created Date</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow 
                          key={category._id} 
                          className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {category.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-sm">
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                              {category.description || (
                                <span className="text-slate-400 dark:text-slate-500 italic">No description</span>
                              )}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600">
                              {category.createdAt 
                                ? new Date(category.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : '-'
                              }
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleEdit(category)} 
                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors duration-200"
                                title="Edit Category"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(category._id)} 
                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                                title="Delete Category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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