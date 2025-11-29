// import { useState, useEffect } from 'react';
// import { Button } from './ui/Button';
// import { Input } from './ui/Input';
// import { Card } from './ui/Card';
// import { Alert } from './ui/Alert';
// import { api } from '@/lib/api-client';
// import { Plus, Trash2 } from 'lucide-react';

// interface Product {
//   _id: string;
//   name: string;
//   sku: string;
//   salePrice: number;
// }

// interface SaleItem {
//   productId: string;
//   productName: string;
//   quantity: number;
//   salePrice: number;
// }

// interface AddDailySaleProps {
//   date: string;
//   onSuccess?: () => void;
// }

// export function AddDailySaleModal({ date, onSuccess }: AddDailySaleProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<string>('');
//   const [quantity, setQuantity] = useState('');
//   const [salePrice, setSalePrice] = useState('');
//   const [items, setItems] = useState<SaleItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [productsLoading, setProductsLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [discount, setDiscount] = useState('0');
//   const [paymentMethod, setPaymentMethod] = useState('cash');
//   const [notes, setNotes] = useState('');

//   useEffect(() => {
//     if (isOpen) {
//       fetchProducts();
//     }
//   }, [isOpen]);

//   const fetchProducts = async () => {
//     try {
//       setProductsLoading(true);
//       const res = await api.getProducts({ limit: 1000 });
//       setProducts(res.data.data || []);
//     } catch (err) {
//       setError('Failed to load products');
//     } finally {
//       setProductsLoading(false);
//     }
//   };

//   const handleAddItem = () => {
//     if (!selectedProduct || !quantity) {
//       setError('Please select product and enter quantity');
//       return;
//     }

//     const product = products.find((p) => p._id === selectedProduct);
//     if (!product) {
//       setError('Product not found');
//       return;
//     }

//     const newItem: SaleItem = {
//       productId: product._id,
//       productName: product.name,
//       quantity: parseInt(quantity),
//       salePrice: parseFloat(salePrice || product.salePrice.toString()),
//     };

//     setItems([...items, newItem]);
//     setSelectedProduct('');
//     setQuantity('');
//     setSalePrice('');
//     setError('');
//   };

//   const handleRemoveItem = (index: number) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (items.length === 0) {
//       setError('Please add at least one item');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setMessage('');

//     try {
//       const response = await api.createSale({
//         items,
//         discount: parseFloat(discount) || 0,
//         paymentMethod,
//         notes: `${notes} [Date: ${date}]`,
//       });

//       setMessage(`✓ Sale recorded successfully! Total: $${response.data.data.total.toFixed(2)}`);
//       setItems([]);
//       setDiscount('0');
//       setPaymentMethod('cash');
//       setNotes('');

//       setTimeout(() => {
//         setIsOpen(false);
//         onSuccess?.();
//       }, 1500);
//     } catch (err: any) {
//       setError(err.response?.data?.error || 'Failed to record sale');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const subtotal = items.reduce((sum, item) => sum + item.quantity * item.salePrice, 0);
//   const discountAmount = parseFloat(discount) || 0;
//   const total = subtotal - discountAmount;

//   if (!isOpen) {
//     return (
//       <Button onClick={() => setIsOpen(true)} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
//         <Plus className="w-4 h-4" />
//         Add Today Sale
//       </Button>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <h2 className="text-xl font-bold mb-4">Record Daily Sale - {new Date(date).toLocaleDateString()}</h2>

//           {error && <Alert className="mb-4 bg-red-50 border-red-200">{error}</Alert>}
//           {message && <Alert className="mb-4 bg-green-50 border-green-200">{message}</Alert>}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Product Selection */}
//             <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4">
//               <h3 className="font-semibold">Add Products</h3>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Product *</label>
//                   <select
//                     value={selectedProduct}
//                     onChange={(e) => {
//                       setSelectedProduct(e.target.value);
//                       const product = products.find((p) => p._id === e.target.value);
//                       if (product) {
//                         setSalePrice(product.salePrice.toString());
//                       }
//                     }}
//                     className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     disabled={productsLoading}
//                   >
//                     <option value="">{productsLoading ? 'Loading...' : 'Select product'}</option>
//                     {products.map((product) => (
//                       <option key={product._id} value={product._id}>
//                         {product.name} ({product.sku})
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Quantity *</label>
//                   <Input
//                     type="number"
//                     value={quantity}
//                     onChange={(e) => setQuantity(e.target.value)}
//                     placeholder="0"
//                     min="1"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Sale Price</label>
//                   <Input
//                     type="number"
//                     value={salePrice}
//                     onChange={(e) => setSalePrice(e.target.value)}
//                     placeholder="0.00"
//                     step="0.01"
//                   />
//                 </div>
//               </div>

//               <Button
//                 type="button"
//                 onClick={handleAddItem}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Item
//               </Button>
//             </div>

//             {/* Items Table */}
//             {items.length > 0 && (
//               <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead className="bg-slate-100 dark:bg-slate-800">
//                       <tr>
//                         <th className="px-4 py-2 text-left font-semibold">Product</th>
//                         <th className="px-4 py-2 text-center font-semibold">Qty</th>
//                         <th className="px-4 py-2 text-right font-semibold">Price</th>
//                         <th className="px-4 py-2 text-right font-semibold">Total</th>
//                         <th className="px-4 py-2 text-center font-semibold">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {items.map((item, idx) => (
//                         <tr key={idx} className="border-t border-slate-200 dark:border-slate-700">
//                           <td className="px-4 py-2">{item.productName}</td>
//                           <td className="px-4 py-2 text-center">{item.quantity}</td>
//                           <td className="px-4 py-2 text-right">${item.salePrice.toFixed(2)}</td>
//                           <td className="px-4 py-2 text-right font-semibold">
//                             ${(item.quantity * item.salePrice).toFixed(2)}
//                           </td>
//                           <td className="px-4 py-2 text-center">
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveItem(idx)}
//                               className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {/* Sale Details */}
//             <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4">
//               <h3 className="font-semibold">Sale Details</h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Payment Method *</label>
//                   <select
//                     value={paymentMethod}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                     className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="cash">Cash</option>
//                     <option value="card">Card</option>
//                     <option value="cheque">Cheque</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Discount ($)</label>
//                   <Input
//                     type="number"
//                     value={discount}
//                     onChange={(e) => setDiscount(e.target.value)}
//                     placeholder="0.00"
//                     step="0.01"
//                     min="0"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium mb-1">Notes (optional)</label>
//                   <textarea
//                     value={notes}
//                     onChange={(e) => setNotes(e.target.value)}
//                     placeholder="e.g., Customer name, notes, etc."
//                     className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     rows={2}
//                   />
//                 </div>
//               </div>

//               {/* Summary */}
//               <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span>Subtotal:</span>
//                   <span className="font-semibold">${subtotal.toFixed(2)}</span>
//                 </div>
//                 {discountAmount > 0 && (
//                   <div className="flex justify-between text-red-600">
//                     <span>Discount:</span>
//                     <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between text-lg font-bold border-t border-slate-300 dark:border-slate-700 pt-2">
//                   <span>Total:</span>
//                   <span className="text-green-600">${total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-2 pt-4">
//               <Button
//                 type="submit"
//                 disabled={loading || items.length === 0}
//                 className="flex-1 bg-green-600 hover:bg-green-700 text-white"
//               >
//                 {loading ? 'Recording...' : 'Record Sale'}
//               </Button>
//               <Button
//                 type="button"
//                 onClick={() => setIsOpen(false)}
//                 className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
//               >
//                 Cancel
//               </Button>
//             </div>
//           </form>
//         </div>
//       </Card>
//     </div>
//   );
// }




import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Alert } from './ui/Alert';
import { api } from '@/lib/api-client';
import { Plus, Trash2, X, ShoppingCart, DollarSign, Package, Calculator, CreditCard, Calendar } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  sku: string;
  salePrice: number;
}

interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  salePrice: number;
}

interface AddDailySaleProps {
  date: string;
  onSuccess?: () => void;
}

export function AddDailySaleModal({ date, onSuccess }: AddDailySaleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [discount, setDiscount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await api.getProducts({ limit: 1000 });
      setProducts(res.data.data || []);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!selectedProduct || !quantity) {
      setError('Please select product and enter quantity');
      return;
    }

    const product = products.find((p) => p._id === selectedProduct);
    if (!product) {
      setError('Product not found');
      return;
    }

    const newItem: SaleItem = {
      productId: product._id,
      productName: product.name,
      quantity: parseInt(quantity),
      salePrice: parseFloat(salePrice || product.salePrice.toString()),
    };

    setItems([...items, newItem]);
    setSelectedProduct('');
    setQuantity('');
    setSalePrice('');
    setError('');
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Please add at least one item');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.createSale({
        items,
        discount: parseFloat(discount) || 0,
        paymentMethod,
        notes: `${notes} [Date: ${date}]`,
      });

      setMessage(`✓ Sale recorded successfully! Total: $${response.data.data.total.toFixed(2)}`);
      setItems([]);
      setDiscount('0');
      setPaymentMethod('cash');
      setNotes('');

      setTimeout(() => {
        setIsOpen(false);
        onSuccess?.();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to record sale');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.salePrice, 0);
  const discountAmount = parseFloat(discount) || 0;
  const total = subtotal - discountAmount;

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl flex items-center gap-2 px-4 py-2.5"
      >
        <Plus className="w-4 h-4" />
        Add Sale
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-hidden bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Record Daily Sale</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(95vh-140px)] overflow-y-auto">
          {error && (
            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 rounded-xl">
              <div className="text-red-700 dark:text-red-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {error}
              </div>
            </Alert>
          )}
          
          {message && (
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 rounded-xl">
              <div className="text-green-700 dark:text-green-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {message}
              </div>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection */}
            <div className="bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Add Products to Sale
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Product *</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => {
                      setSelectedProduct(e.target.value);
                      const product = products.find((p) => p._id === e.target.value);
                      if (product) {
                        setSalePrice(product.salePrice.toString());
                      }
                    }}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 text-slate-900 dark:text-white"
                    disabled={productsLoading}
                  >
                    <option value="">{productsLoading ? 'Loading products...' : 'Select product'}</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Quantity *</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    min="1"
                    className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Unit Price</label>
                  <Input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 opacity-0">Add</label>
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </div>
              </div>
            </div>

            {/* Items Table */}
            {items.length > 0 && (
              <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 border-b border-slate-200 dark:border-slate-600">
                  <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                    Sale Items ({items.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-300">Product</th>
                        <th className="px-6 py-4 text-center font-semibold text-slate-700 dark:text-slate-300">Quantity</th>
                        <th className="px-6 py-4 text-right font-semibold text-slate-700 dark:text-slate-300">Unit Price</th>
                        <th className="px-6 py-4 text-right font-semibold text-slate-700 dark:text-slate-300">Total</th>
                        <th className="px-6 py-4 text-center font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                      {items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="font-medium text-slate-900 dark:text-white">{item.productName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="font-semibold text-slate-900 dark:text-white">{item.quantity}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-slate-700 dark:text-slate-300">${item.salePrice.toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold text-slate-900 dark:text-white">
                              ${(item.quantity * item.salePrice).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sale Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Payment & Notes */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Payment Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Payment Method *</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 text-slate-900 dark:text-white"
                      >
                        <option value="cash">💵 Cash</option>
                        <option value="card">💳 Card</option>
                        <option value="cheque">📄 Cheque</option>
                        <option value="other">❓ Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Discount ($)</label>
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Notes (optional)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g., Customer name, special instructions, etc."
                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 text-slate-900 dark:text-white placeholder-slate-500 resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Order Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center py-2 border-t border-slate-200 dark:border-slate-600">
                      <span className="text-red-600 dark:text-red-400">Discount:</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-3 border-t border-slate-300 dark:border-slate-600 pt-4">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Total Amount:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading || items.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Recording Sale...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Record Sale - ${total.toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}