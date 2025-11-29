// 'use client';

// import { ProtectedLayout } from '@/components/ProtectedLayout';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
// import { Input } from '@/components/ui/Input';
// import { Alert, AlertDescription } from '@/components/ui/Alert';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
// import { useEffect, useState } from 'react';
// import { api } from '@/lib/api-client';
// import { Calendar, Filter, TrendingDown, TrendingUp, Loader2 } from 'lucide-react';
// import { Skeleton } from '@/components/ui/Skeleton';

// interface InventoryLog {
//   _id: string;
//   productId: {
//     _id: string;
//     name: string;
//     sku: string;
//   };
//   type: 'purchase' | 'sale' | 'adjustment' | 'return';
//   quantity: number;
//   previousQuantity: number;
//   newQuantity: number;
//   reason?: string;
//   reference?: string;
//   performedBy: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   createdAt: string;
// }

// interface DailySummary {
//   date: string;
//   totalSales: number;
//   totalSaleQuantity: number;
//   totalStockIn: number;
//   totalStockInQuantity: number;
//   totalAdjustments: number;
// }

// export default function InventoryHistoryPage() {
//   const [logs, setLogs] = useState<InventoryLog[]>([]);
//   const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [filterType, setFilterType] = useState<'all' | 'sale' | 'purchase' | 'adjustment'>('all');
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   useEffect(() => {
//     fetchData();
//   }, [selectedDate, filterType]);

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       const params = {
//         date: selectedDate,
//         type: filterType !== 'all' ? filterType : undefined,
//       };

//       // Fetch inventory logs
//       const logsRes = await api.getInventoryLogs(params);
//       setLogs(logsRes.data.data || []);

//       // Calculate daily summary
//       const sales = logsRes.data.data.filter((log: InventoryLog) => log.type === 'sale');
//       const purchases = logsRes.data.data.filter((log: InventoryLog) => log.type === 'purchase');
//       const adjustments = logsRes.data.data.filter((log: InventoryLog) => 
//         log.type === 'adjustment' || log.type === 'return'
//       );

//       const totalSaleQuantity = sales.reduce((sum: number, log: InventoryLog) => sum + log.quantity, 0);
//       const totalSaleValue = sales.reduce((sum: number, log: InventoryLog) => {
//         // Try to get product sale price if available
//         return sum + (log.quantity * 0); // We'll need to fetch prices separately
//       }, 0);

//       const totalStockInQuantity = purchases.reduce((sum: number, log: InventoryLog) => sum + log.quantity, 0);

//       setDailySummary({
//         date: selectedDate,
//         totalSales: sales.length,
//         totalSaleQuantity,
//         totalStockIn: purchases.length,
//         totalStockInQuantity,
//         totalAdjustments: adjustments.length,
//       });
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to load inventory history' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getTypeColor = (type: string) => {
//     switch (type) {
//       case 'sale':
//         return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
//       case 'purchase':
//         return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
//       case 'adjustment':
//         return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
//       case 'return':
//         return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
//       default:
//         return '';
//     }
//   };

//   const getTypeBadgeColor = (type: string) => {
//     switch (type) {
//       case 'sale':
//         return 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200';
//       case 'purchase':
//         return 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200';
//       case 'adjustment':
//         return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200';
//       case 'return':
//         return 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200';
//       default:
//         return '';
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   return (
//     <ProtectedLayout>
//       <div className="w-full space-y-6">
//         {/* Header */}
//         <div>
//           <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
//             Inventory History
//           </h1>
//           <p className="text-slate-500 dark:text-slate-400 mt-2">
//             Track all stock movements and daily sales
//           </p>
//         </div>

//         {/* Messages */}
//         {message && (
//           <Alert type={message.type === 'error' ? 'destructive' : 'success'}>
//             <AlertDescription>{message.text}</AlertDescription>
//           </Alert>
//         )}

//         {/* Daily Summary Cards */}
//         {dailySummary && (
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             {/* Date Card */}
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
//                     <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-slate-600 dark:text-slate-400">Date</p>
//                     <p className="text-lg font-semibold">{new Date(dailySummary.date).toLocaleDateString()}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Sales Card */}
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
//                     <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-slate-600 dark:text-slate-400">Total Sales</p>
//                     <div>
//                       <p className="text-lg font-semibold">{dailySummary.totalSales}</p>
//                       <p className="text-xs text-slate-500">Qty: {dailySummary.totalSaleQuantity}</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Stock In Card */}
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
//                     <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-slate-600 dark:text-slate-400">Stock In</p>
//                     <div>
//                       <p className="text-lg font-semibold">{dailySummary.totalStockIn}</p>
//                       <p className="text-xs text-slate-500">Qty: {dailySummary.totalStockInQuantity}</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Adjustments Card */}
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-yellow-100 dark:bg-yellow-950 rounded-lg">
//                     <Filter className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-slate-600 dark:text-slate-400">Adjustments</p>
//                     <p className="text-lg font-semibold">{dailySummary.totalAdjustments}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Net Movement Card */}
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
//                     <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-slate-600 dark:text-slate-400">Net Movement</p>
//                     <p className={`text-lg font-semibold ${
//                       (dailySummary.totalStockInQuantity - dailySummary.totalSaleQuantity) >= 0
//                         ? 'text-green-600'
//                         : 'text-red-600'
//                     }`}>
//                       {(dailySummary.totalStockInQuantity - dailySummary.totalSaleQuantity) >= 0 ? '+' : ''}
//                       {dailySummary.totalStockInQuantity - dailySummary.totalSaleQuantity}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* Filters */}
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <label className="block text-sm font-medium mb-2">Select Date</label>
//                 <Input
//                   type="date"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   className="bg-slate-50 dark:bg-slate-900"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="block text-sm font-medium mb-2">Filter by Type</label>
//                 <select
//                   value={filterType}
//                   onChange={(e) => setFilterType(e.target.value as any)}
//                   className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="all">All Transactions</option>
//                   <option value="sale">Sales Only</option>
//                   <option value="purchase">Stock In Only</option>
//                   <option value="adjustment">Adjustments Only</option>
//                 </select>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Logs Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Filter className="w-5 h-5 text-purple-500" />
//               Transaction Details
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <div className="space-y-2">
//                 {[...Array(5)].map((_, i) => (
//                   <Skeleton key={i} className="h-12" />
//                 ))}
//               </div>
//             ) : logs.length === 0 ? (
//               <div className="text-center py-12">
//                 <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
//                 <p className="text-slate-500">No transactions found for the selected date</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date & Time</TableHead>
//                       <TableHead>Product</TableHead>
//                       <TableHead>Type</TableHead>
//                       <TableHead className="text-center">Quantity</TableHead>
//                       <TableHead className="text-center">Before</TableHead>
//                       <TableHead className="text-center">After</TableHead>
//                       <TableHead>Reason</TableHead>
//                       <TableHead>Reference</TableHead>
//                       <TableHead>Performed By</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {logs.map((log) => (
//                       <TableRow key={log._id} className={`hover:bg-slate-50 dark:hover:bg-slate-900 border-l-4 ${
//                         log.type === 'sale' ? 'border-l-red-500' :
//                         log.type === 'purchase' ? 'border-l-green-500' :
//                         log.type === 'return' ? 'border-l-blue-500' :
//                         'border-l-yellow-500'
//                       }`}>
//                         <TableCell className="text-sm">{formatDate(log.createdAt)}</TableCell>
//                         <TableCell>
//                           <div>
//                             <p className="font-medium">{log.productId.name}</p>
//                             <p className="text-xs text-slate-500">{log.productId.sku}</p>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(log.type)}`}>
//                             {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
//                           </span>
//                         </TableCell>
//                         <TableCell className="text-center font-semibold">{log.quantity}</TableCell>
//                         <TableCell className="text-center text-slate-600 dark:text-slate-400">
//                           {log.previousQuantity}
//                         </TableCell>
//                         <TableCell className="text-center font-semibold">
//                           {log.newQuantity}
//                         </TableCell>
//                         <TableCell className="text-sm text-slate-600 dark:text-slate-400">
//                           {log.reason || '-'}
//                         </TableCell>
//                         <TableCell className="text-sm text-slate-600 dark:text-slate-400">
//                           {log.reference || '-'}
//                         </TableCell>
//                         <TableCell className="text-sm">
//                           <div>
//                             <p className="font-medium">{log.performedBy.name}</p>
//                             <p className="text-xs text-slate-500">{log.performedBy.email}</p>
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
import { Input } from '@/components/ui/Input';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { Calendar, Filter, TrendingDown, TrendingUp, Loader2, ArrowUpDown, FileText, Users, Package, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';

interface InventoryLog {
  _id: string;
  productId: {
    _id: string;
    name: string;
    sku: string;
  };
  type: 'purchase' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  reference?: string;
  performedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface DailySummary {
  date: string;
  totalSales: number;
  totalSaleQuantity: number;
  totalStockIn: number;
  totalStockInQuantity: number;
  totalAdjustments: number;
}

export default function InventoryHistoryPage() {
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'purchase' | 'adjustment'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, [selectedDate, filterType]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const params = {
        date: selectedDate,
        type: filterType !== 'all' ? filterType : undefined,
      };

      // Fetch inventory logs
      const logsRes = await api.getInventoryLogs(params);
      setLogs(logsRes.data.data || []);

      // Calculate daily summary
      const sales = logsRes.data.data.filter((log: InventoryLog) => log.type === 'sale');
      const purchases = logsRes.data.data.filter((log: InventoryLog) => log.type === 'purchase');
      const adjustments = logsRes.data.data.filter((log: InventoryLog) => 
        log.type === 'adjustment' || log.type === 'return'
      );

      const totalSaleQuantity = sales.reduce((sum: number, log: InventoryLog) => sum + log.quantity, 0);
      const totalSaleValue = sales.reduce((sum: number, log: InventoryLog) => {
        return sum + (log.quantity * 0);
      }, 0);

      const totalStockInQuantity = purchases.reduce((sum: number, log: InventoryLog) => sum + log.quantity, 0);

      setDailySummary({
        date: selectedDate,
        totalSales: sales.length,
        totalSaleQuantity,
        totalStockIn: purchases.length,
        totalStockInQuantity,
        totalAdjustments: adjustments.length,
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load inventory history' });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800 dark:text-red-400';
      case 'purchase':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 dark:text-green-400';
      case 'adjustment':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-400';
      case 'return':
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400';
      default:
        return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <TrendingDown className="w-4 h-4" />;
      case 'purchase':
        return <TrendingUp className="w-4 h-4" />;
      case 'adjustment':
        return <Filter className="w-4 h-4" />;
      case 'return':
        return <ArrowUpDown className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Inventory History</h1>
                  <p className="text-slate-600 dark:text-slate-400">Track all stock movements and daily transactions</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
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

          {/* Daily Summary Cards */}
          {dailySummary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Date Card */}
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Selected Date</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-white mt-2">
                        {new Date(dailySummary.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                      <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sales Card */}
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Sales</p>
                      <div className="mt-2">
                        <p className="text-xl font-bold text-red-600 dark:text-red-400">{dailySummary.totalSales}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {dailySummary.totalSaleQuantity} units sold
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-red-100 dark:bg-red-900 rounded-xl">
                      <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock In Card */}
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Stock In</p>
                      <div className="mt-2">
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">{dailySummary.totalStockIn}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {dailySummary.totalStockInQuantity} units added
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Adjustments Card */}
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Adjustments</p>
                      <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                        {dailySummary.totalAdjustments}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
                      <Filter className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Net Movement Card */}
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Net Movement</p>
                      <p className={`text-xl font-bold mt-2 ${
                        (dailySummary.totalStockInQuantity - dailySummary.totalSaleQuantity) >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {(dailySummary.totalStockInQuantity - dailySummary.totalSaleQuantity) >= 0 ? '+' : ''}
                        {dailySummary.totalStockInQuantity - dailySummary.totalSaleQuantity}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                      <ArrowUpDown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters Section */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Select Date
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-blue-600" />
                    Filter by Transaction Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                  >
                    <option value="all">All Transactions</option>
                    <option value="sale">Sales Only</option>
                    <option value="purchase">Stock In Only</option>
                    <option value="adjustment">Adjustments Only</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Logs Table */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  Transaction Details
                  <span className="text-sm font-normal text-slate-600 dark:text-slate-400 ml-2">
                    ({logs.length} transactions)
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
              ) : logs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    No Transactions Found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500">
                    No transactions recorded for the selected date and filters
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Date & Time</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Product</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Type</TableHead>
                        <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">Quantity</TableHead>
                        <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">Before</TableHead>
                        <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">After</TableHead>
                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Performed By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow 
                          key={log._id} 
                          className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                        >
                          <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                            {formatDate(log.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{log.productId.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{log.productId.sku}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getTypeColor(log.type)}`}
                            >
                              {getTypeIcon(log.type)}
                              {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {log.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="text-center text-slate-600 dark:text-slate-400">
                            {log.previousQuantity}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {log.newQuantity}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{log.performedBy.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{log.performedBy.email}</p>
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