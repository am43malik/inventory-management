// 'use client';

// import { ProtectedLayout } from '@/components/ProtectedLayout';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
// import { Input } from '@/components/ui/Input';
// import { Button } from '@/components/ui/Button';
// import { useEffect, useState } from 'react';
// import { api } from '@/lib/api-client';
// import { ChevronDown, ChevronUp, ShoppingCart, Filter, Calendar } from 'lucide-react';
// import { Skeleton } from '@/components/ui/Skeleton';
// import { Badge } from '@/components/ui/Badge';
// import { AddDailySaleModal } from '@/components/AddDailySaleModal';

// interface Sale {
//   _id: string;
//   items: any[];
//   subtotal: number;
//   taxAmount: number;
//   discount: number;
//   total: number;
//   paymentMethod: string;
//   cashier: any;
//   createdAt: string;
//   status: string;
// }

// export default function SalesPage() {
//   const [sales, setSales] = useState<Sale[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

//   useEffect(() => {
//     fetchSales();
//   }, []);

//   const fetchSales = async () => {
//     try {
//       const res = await api.getSales({
//         startDate,
//         endDate,
//         limit: 50,
//       });
//       setSales(res.data.data);
//     } catch (error) {
//       console.error('Failed to fetch sales:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleFilter = () => {
//     setIsLoading(true);
//     fetchSales();
//   };

//   const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
//   const totalTransactions = sales.length;

//   if (isLoading) {
//     return (
//       <ProtectedLayout>
//         <div className="space-y-6">
//           <Skeleton className="h-10 w-40" />
//           <div className="grid grid-cols-2 gap-4">
//             {[...Array(2)].map((_, i) => (
//               <Skeleton key={i} className="h-24" />
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
//         <div>
//           <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">Sales History</h1>
//           <p className="text-slate-500 dark:text-slate-400 mt-2">Track all your sales transactions</p>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-2 gap-4">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
//                   <p className="text-3xl font-bold mt-2">${totalRevenue.toFixed(2)}</p>
//                 </div>
//                 <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
//                   <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <p className="text-sm text-slate-500 dark:text-slate-400">Total Transactions</p>
//                   <p className="text-3xl font-bold mt-2">{totalTransactions}</p>
//                 </div>
//                 <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
//                   <Filter className="w-6 h-6 text-orange-600 dark:text-orange-400" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filter Section */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Calendar className="w-5 h-5" />
//               Filter by Date
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex gap-3 flex-wrap items-end">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Start Date</label>
//                 <Input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">End Date</label>
//                 <Input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
//                 />
//               </div>
//               <Button 
//                 onClick={handleFilter}
//                 className="bg-linear-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white"
//               >
//                 Apply Filter
//               </Button>
//               <div className="flex-1"></div>
//               <AddDailySaleModal date={selectedDate} onSuccess={() => fetchSales()} />
//             </div>
//             <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
//               <label className="text-sm font-medium">Record Sale for Date</label>
//               <Input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 className="mt-2 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 max-w-xs"
//               />
//               <p className="text-xs text-slate-500 mt-2">Select a date and click "Add Today Sale" button to record sales for that specific date</p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Sales List */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <ShoppingCart className="w-5 h-5 text-purple-500" />
//               Sales Transactions ({totalTransactions})
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {sales.length === 0 ? (
//               <div className="text-center py-12">
//                 <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
//                 <p className="text-slate-500">No sales found</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {sales.map((sale) => (
//                   <div
//                     key={sale._id}
//                     className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition"
//                   >
//                     <button
//                       onClick={() =>
//                         setExpandedId(expandedId === sale._id ? null : sale._id)
//                       }
//                       className="w-full bg-slate-50 dark:bg-slate-900 p-4 flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-800 transition"
//                     >
//                       <div className="flex-1 text-left">
//                         <p className="font-semibold">
//                           Sale #{sale._id.slice(-6).toUpperCase()}
//                         </p>
//                         <div className="flex items-center gap-3 mt-1">
//                           <span className="text-xs text-slate-500">
//                             {new Date(sale.createdAt).toLocaleString()}
//                           </span>
//                           <Badge variant="outline" className="text-xs">
//                             {sale.paymentMethod}
//                           </Badge>
//                           {sale.cashier?.name && (
//                             <span className="text-xs text-slate-500">
//                               by {sale.cashier.name}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="text-right mr-4">
//                         <p className="text-lg font-bold bg-linear-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
//                           ${sale.total.toFixed(2)}
//                         </p>
//                         <p className="text-xs text-slate-500 mt-1">{sale.items.length} items</p>
//                       </div>
//                       <div className="text-slate-400">
//                         {expandedId === sale._id ? (
//                           <ChevronUp className="w-5 h-5" />
//                         ) : (
//                           <ChevronDown className="w-5 h-5" />
//                         )}
//                       </div>
//                     </button>

//                     {expandedId === sale._id && (
//                       <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-700 space-y-4">
//                         {/* Items */}
//                         <div className="space-y-2">
//                           <h4 className="font-semibold text-sm mb-2">Items</h4>
//                           {sale.items.map((item, idx) => (
//                             <div
//                               key={idx}
//                               className="flex justify-between text-sm py-2 px-3 bg-slate-50 dark:bg-slate-900 rounded"
//                             >
//                               <span>
//                                 {item.productName}{' '}
//                                 <span className="text-slate-500">x{item.quantity}</span>
//                               </span>
//                               <span className="font-semibold">
//                                 ${item.subtotal.toFixed(2)}
//                               </span>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Summary */}
//                         <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
//                             <span className="font-semibold">${sale.subtotal.toFixed(2)}</span>
//                           </div>
//                           {sale.taxAmount > 0 && (
//                             <div className="flex justify-between">
//                               <span className="text-slate-600 dark:text-slate-400">Tax</span>
//                               <span className="font-semibold">${sale.taxAmount.toFixed(2)}</span>
//                             </div>
//                           )}
//                           {sale.discount > 0 && (
//                             <div className="flex justify-between">
//                               <span className="text-slate-600 dark:text-slate-400">Discount</span>
//                               <span className="font-semibold text-red-600">-${sale.discount.toFixed(2)}</span>
//                             </div>
//                           )}
//                           <div className="flex justify-between font-bold text-base bg-linear-to-r from-purple-50 to-orange-50 dark:from-purple-950 dark:to-orange-950 p-3 rounded border border-purple-200 dark:border-purple-800">
//                             <span>Total</span>
//                             <span className="bg-linear-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
//                               ${sale.total.toFixed(2)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
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
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { ChevronDown, ChevronUp, ShoppingCart, Filter, Calendar, DollarSign, TrendingUp, Users, Receipt, ArrowUpRight, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { AddDailySaleModal } from '@/components/AddDailySaleModal';

interface Sale {
  _id: string;
  items: any[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  paymentMethod: string;
  cashier: any;
  createdAt: string;
  status: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await api.getSales({
        startDate,
        endDate,
        limit: 50,
      });
      setSales(res.data.data);
    } catch (error) {
      console.error('Failed to fetch sales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = () => {
    setIsLoading(true);
    fetchSales();
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = sales.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const totalItemsSold = sales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-10 w-40" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
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
                  <Receipt className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Sales History</h1>
                  <p className="text-slate-600 dark:text-slate-400">Track and analyze all your sales transactions</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleFilter}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Apply Filters
              </Button>
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard 
              label="Total Revenue" 
              value={`$${totalRevenue.toFixed(2)}`}
              icon={<DollarSign className="w-6 h-6" />}
              trend="up"
              color="blue"
            />
            <StatCard 
              label="Transactions" 
              value={totalTransactions.toString()}
              icon={<ShoppingCart className="w-6 h-6" />}
              trend="neutral"
              color="purple"
            />
            <StatCard 
              label="Avg. Transaction" 
              value={`$${averageTransaction.toFixed(2)}`}
              icon={<TrendingUp className="w-6 h-6" />}
              trend="up"
              color="green"
            />
            <StatCard 
              label="Items Sold" 
              value={totalItemsSold.toString()}
              icon={<Users className="w-6 h-6" />}
              trend="up"
              color="orange"
            />
          </div>

          {/* Filter Section */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                Filter Sales Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Quick Add Sale
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                    />
                    <AddDailySaleModal date={selectedDate} onSuccess={() => fetchSales()} />
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4" />
                  Select a date and click "Add Sale" to record transactions for specific dates
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sales List */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  Sales Transactions
                  <span className="text-sm font-normal text-slate-600 dark:text-slate-400 ml-2">
                    ({totalTransactions} records)
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sales.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    No Sales Found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500 mb-4">
                    No sales transactions match your current filters
                  </p>
                  <Button 
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                      fetchSales();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sales.map((sale) => (
                    <div
                      key={sale._id}
                      className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 bg-white dark:bg-slate-800"
                    >
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === sale._id ? null : sale._id)
                        }
                        className="w-full p-6 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
                      >
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-bold text-slate-900 dark:text-white text-lg">
                              Sale #{sale._id.slice(-6).toUpperCase()}
                            </p>
                            <Badge 
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                sale.paymentMethod === 'cash' 
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
                                  : sale.paymentMethod === 'card'
                                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
                                  : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800'
                              }`}
                            >
                              {sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(sale.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {sale.cashier?.name || 'System'}
                            </span>
                            <span className="flex items-center gap-1">
                              <ShoppingCart className="w-4 h-4" />
                              {sale.items.length} items
                            </span>
                          </div>
                        </div>
                        <div className="text-right mr-4">
                          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            ${sale.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1 justify-end">
                            <ArrowUpRight className="w-3 h-3" />
                            ${sale.subtotal.toFixed(2)} + tax
                          </p>
                        </div>
                        <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                          {expandedId === sale._id ? (
                            <ChevronUp className="w-6 h-6" />
                          ) : (
                            <ChevronDown className="w-6 h-6" />
                          )}
                        </div>
                      </button>

                      {expandedId === sale._id && (
                        <div className="p-6 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700 space-y-6">
                          {/* Items */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-slate-800 dark:text-white text-sm uppercase tracking-wide">Items Purchased</h4>
                            <div className="space-y-2">
                              {sale.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg hover:shadow-sm transition-all duration-200"
                                >
                                  <div className="flex-1">
                                    <span className="font-medium text-slate-900 dark:text-white">
                                      {item.productName}
                                    </span>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-600 dark:text-slate-400">
                                      <span>Qty: {item.quantity}</span>
                                      <span>Price: ${item.salePrice?.toFixed(2) || '0.00'}</span>
                                    </div>
                                  </div>
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    ${item.subtotal.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Summary */}
                          <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
                            <h4 className="font-semibold text-slate-800 dark:text-white text-sm uppercase tracking-wide">Transaction Summary</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between py-2">
                                <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                                <span className="font-semibold text-slate-900 dark:text-white">${sale.subtotal.toFixed(2)}</span>
                              </div>
                              {sale.taxAmount > 0 && (
                                <div className="flex justify-between py-2">
                                  <span className="text-slate-600 dark:text-slate-400">Tax</span>
                                  <span className="font-semibold text-slate-900 dark:text-white">${sale.taxAmount.toFixed(2)}</span>
                                </div>
                              )}
                              {sale.discount > 0 && (
                                <div className="flex justify-between py-2">
                                  <span className="text-slate-600 dark:text-slate-400">Discount</span>
                                  <span className="font-semibold text-red-600 dark:text-red-400">-${sale.discount.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-bold text-lg py-3 px-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <span className="text-slate-900 dark:text-white">Total Amount</span>
                                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                  ${sale.total.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
}

function StatCard({ 
  label, 
  value,
  icon,
  trend,
  color 
}: { 
  label: string
  value: string
  icon: React.ReactNode
  trend: 'up' | 'down' | 'neutral'
  color: string
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-violet-500',
    orange: 'from-orange-500 to-amber-500'
  }[color];

  const trendIcons = {
    up: <ArrowUpRight className="w-4 h-4 text-green-500" />,
    down: <ChevronDown className="w-4 h-4 text-red-500" />,
    neutral: <div className="w-4 h-4" />
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${colorClasses}`}></div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <div className="flex items-center gap-1">
              {trendIcons[trend]}
              <span className={`text-xs font-medium ${
                trend === 'up' ? 'text-green-600 dark:text-green-400' :
                trend === 'down' ? 'text-red-600 dark:text-red-400' :
                'text-slate-500'
              }`}>
                {trend === 'up' ? 'Positive' : trend === 'down' ? 'Negative' : 'Stable'}
              </span>
            </div>
          </div>
          <div className={`p-3 bg-gradient-to-br ${colorClasses} rounded-xl text-white shadow-sm`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}