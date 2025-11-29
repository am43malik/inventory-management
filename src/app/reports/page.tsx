// 'use client';

// import { ProtectedLayout } from '@/components/ProtectedLayout';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { useEffect, useState } from 'react';
// import { api } from '@/lib/api-client';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
// import { Download, RefreshCw, TrendingUp, Package, DollarSign } from 'lucide-react';
// import { Skeleton } from '@/components/ui/Skeleton';

// interface ReportData {
//   period?: string;
//   startDate?: string;
//   endDate?: string;
//   totalRevenue: number;
//   totalCost: number;
//   totalProfit: number;
//   profitMargin?: number;
//   totalTax: number;
//   totalDiscount: number;
//   totalSales: number;
//   dailyBreakdown?: any[];
//   productBreakdown?: any[];
// }

// const COLORS = ['#8b5cf6', '#f97316', '#06b6d4', '#ec4899', '#14b8a6'];

// export default function ReportsPage() {
//   const [period, setPeriod] = useState('30');
//   const [reportData, setReportData] = useState<ReportData | null>(null);
//   const [topProducts, setTopProducts] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   useEffect(() => {
//     fetchReports();
//   }, [period]);

//   const fetchReports = async () => {
//     setIsRefreshing(true);
//     try {
//       const [periodRes, topRes] = await Promise.all([
//         api.getPeriodReport(period),
//         api.getTopProducts(10),
//       ]);

//       setReportData(periodRes.data.data);
//       setTopProducts(topRes.data.data.topProducts);
//     } catch (error) {
//       console.error('Failed to fetch reports:', error);
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   };

//   const exportToCSV = () => {
//     if (!reportData) return;

//     const headers = [
//       'Metric',
//       'Value',
//     ];
//     const rows = [
//       ['Period', reportData.period || 'Custom'],
//       ['Start Date', reportData.startDate || '-'],
//       ['End Date', reportData.endDate || '-'],
//       ['Total Revenue', reportData.totalRevenue.toFixed(2)],
//       ['Total Cost', reportData.totalCost.toFixed(2)],
//       ['Total Profit', reportData.totalProfit.toFixed(2)],
//       ['Profit Margin', `${reportData.profitMargin}%`],
//       ['Total Tax', reportData.totalTax.toFixed(2)],
//       ['Total Discount', reportData.totalDiscount.toFixed(2)],
//       ['Total Sales', reportData.totalSales],
//     ];

//     const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `report-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   if (isLoading) {
//     return (
//       <ProtectedLayout>
//         <div className="space-y-6">
//           <Skeleton className="h-10 w-40" />
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[...Array(4)].map((_, i) => (
//               <Skeleton key={i} className="h-32" />
//             ))}
//           </div>
//         </div>
//       </ProtectedLayout>
//     );
//   }

//   const chartData = reportData?.dailyBreakdown || [];
//   const periodLabel = {
//     '7': 'Last 7 Days',
//     '30': 'Last 30 Days',
//     '90': 'Last 90 Days',
//   }[period] || period + ' Days';

//   return (
//     <ProtectedLayout>
//       <div className="w-full space-y-6">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">Reports & Analytics</h1>
//             <p className="text-slate-500 dark:text-slate-400 mt-2">Detailed business insights and performance metrics</p>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               onClick={fetchReports}
//               disabled={isRefreshing}
//               variant="outline"
//               className="flex items-center gap-2"
//             >
//               <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
//               Refresh
//             </Button>
//             <Button
//               onClick={exportToCSV}
//               className="bg-linear-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white flex items-center gap-2"
//             >
//               <Download className="w-4 h-4" />
//               Export CSV
//             </Button>
//           </div>
//         </div>

//         {/* Period Selection */}
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex gap-2 flex-wrap">
//               {[
//                 { value: '7', label: 'Last 7 Days' },
//                 { value: '30', label: 'Last 30 Days' },
//                 { value: '90', label: 'Last 90 Days' },
//               ].map((opt) => (
//                 <button
//                   key={opt.value}
//                   onClick={() => setPeriod(opt.value)}
//                   className={`px-4 py-2 rounded-lg font-medium transition ${
//                     period === opt.value
//                       ? 'bg-linear-to-r from-purple-500 to-orange-500 text-white'
//                       : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
//                   }`}
//                 >
//                   {opt.label}
//                 </button>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {reportData && (
//           <>
//             {/* Stats Grid */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//               <StatBox 
//                 label="Total Revenue" 
//                 value={`$${reportData.totalRevenue.toFixed(2)}`} 
//                 icon={<DollarSign className="w-6 h-6" />}
//                 color="from-purple-500 to-purple-600"
//               />
//               <StatBox 
//                 label="Total Cost" 
//                 value={`$${reportData.totalCost.toFixed(2)}`} 
//                 icon={<Package className="w-6 h-6" />}
//                 color="from-orange-500 to-orange-600"
//               />
//               <StatBox 
//                 label="Total Profit" 
//                 value={`$${reportData.totalProfit.toFixed(2)}`} 
//                 icon={<TrendingUp className="w-6 h-6" />}
//                 color="from-cyan-500 to-cyan-600"
//               />
//               <StatBox 
//                 label="Profit Margin" 
//                 value={`${reportData.profitMargin}%`} 
//                 icon={<TrendingUp className="w-6 h-6" />}
//                 color="from-pink-500 to-pink-600"
//               />
//             </div>

//             {/* Revenue Chart */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <TrendingUp className="w-5 h-5 text-purple-500" />
//                   Revenue Trend ({periodLabel})
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={350}>
//                   <LineChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                     <XAxis dataKey="date" style={{ fontSize: '12px' }} stroke="hsl(var(--foreground))" />
//                     <YAxis style={{ fontSize: '12px' }} stroke="hsl(var(--foreground))" />
//                     <Tooltip 
//                       contentStyle={{ 
//                         backgroundColor: 'hsl(var(--card))',
//                         border: '1px solid hsl(var(--border))',
//                         borderRadius: '8px'
//                       }}
//                     />
//                     <Legend />
//                     <Line type="monotone" dataKey="totalRevenue" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Revenue" />
//                     <Line type="monotone" dataKey="totalProfit" stroke="#f97316" strokeWidth={2} dot={false} name="Profit" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             {/* Two Column Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Daily Breakdown */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Package className="w-5 h-5 text-orange-500" />
//                     Daily Breakdown
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2 max-h-96 overflow-y-auto">
//                     {chartData.length === 0 ? (
//                       <p className="text-center py-8 text-slate-500">No data available</p>
//                     ) : (
//                       chartData.map((day, idx) => (
//                         <div key={idx} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 flex justify-between items-start">
//                           <div>
//                             <p className="font-semibold text-sm">{day.date}</p>
//                             <p className="text-xs text-slate-500 mt-1">{day.transactionCount} transactions</p>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-semibold text-sm">${day.totalRevenue.toFixed(2)}</p>
//                             <p className="text-xs text-green-600 dark:text-green-400">+${day.totalProfit.toFixed(2)}</p>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Top Products */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <TrendingUp className="w-5 h-5 text-cyan-500" />
//                     Top Products
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2 max-h-96 overflow-y-auto">
//                     {topProducts.length === 0 ? (
//                       <p className="text-center py-8 text-slate-500">No products</p>
//                     ) : (
//                       topProducts.map((product, idx) => (
//                         <div key={idx} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
//                           <div className="flex justify-between items-start mb-2">
//                             <div>
//                               <p className="font-semibold text-sm">{idx + 1}. {product.productName}</p>
//                               <p className="text-xs text-slate-500 mt-1">{product.unitsSold} units sold</p>
//                             </div>
//                           </div>
//                           <div className="flex justify-between text-sm">
//                             <span className="text-slate-600 dark:text-slate-400">Revenue:</span>
//                             <span className="font-semibold">${product.revenue.toFixed(2)}</span>
//                           </div>
//                           <div className="flex justify-between text-sm">
//                             <span className="text-slate-600 dark:text-slate-400">Profit:</span>
//                             <span className="font-semibold text-green-600 dark:text-green-400">${product.profit.toFixed(2)}</span>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Summary Stats */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Summary Statistics</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <SummaryItem label="Total Transactions" value={reportData.totalSales} />
//                   <SummaryItem label="Total Tax" value={`$${reportData.totalTax.toFixed(2)}`} />
//                   <SummaryItem label="Total Discount" value={`$${reportData.totalDiscount.toFixed(2)}`} />
//                   <SummaryItem label="Avg Per Transaction" value={`$${(reportData.totalRevenue / Math.max(1, reportData.totalSales)).toFixed(2)}`} />
//                 </div>
//               </CardContent>
//             </Card>
//           </>
//         )}
//       </div>
//     </ProtectedLayout>
//   );
// }

// function StatBox({ 
//   label, 
//   value, 
//   icon,
//   color 
// }: { 
//   label: string
//   value: string
//   icon: React.ReactNode
//   color: string
// }) {
//   return (
//     <Card className="overflow-hidden">
//       <div className={`h-1 bg-linear-to-r ${color}`}></div>
//       <CardContent className="p-6">
//         <div className="flex items-start justify-between">
//           <div className="space-y-2">
//             <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
//             <p className="text-3xl font-bold">{value}</p>
//           </div>
//           <div className={`p-3 bg-linear-to-br ${color} rounded-lg text-white`}>
//             {icon}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function SummaryItem({ label, value }: { label: string; value: string | number }) {
//   return (
//     <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 space-y-2">
//       <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
//       <p className="text-xl font-bold">{value}</p>
//     </div>
//   );
// }



'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, RefreshCw, TrendingUp, Package, DollarSign, BarChart3, Calendar, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';

interface ReportData {
  period?: string;
  startDate?: string;
  endDate?: string;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin?: number;
  totalTax: number;
  totalDiscount: number;
  totalSales: number;
  dailyBreakdown?: any[];
  productBreakdown?: any[];
}

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

export default function ReportsPage() {
  const [period, setPeriod] = useState('30');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [period]);

  const fetchReports = async () => {
    setIsRefreshing(true);
    try {
      const [periodRes, topRes] = await Promise.all([
        api.getPeriodReport(period),
        api.getTopProducts(10),
      ]);

      setReportData(periodRes.data.data);
      setTopProducts(topRes.data.data.topProducts);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData) return;

    const headers = [
      'Metric',
      'Value',
    ];
    const rows = [
      ['Period', reportData.period || 'Custom'],
      ['Start Date', reportData.startDate || '-'],
      ['End Date', reportData.endDate || '-'],
      ['Total Revenue', reportData.totalRevenue.toFixed(2)],
      ['Total Cost', reportData.totalCost.toFixed(2)],
      ['Total Profit', reportData.totalProfit.toFixed(2)],
      ['Profit Margin', `${reportData.profitMargin}%`],
      ['Total Tax', reportData.totalTax.toFixed(2)],
      ['Total Discount', reportData.totalDiscount.toFixed(2)],
      ['Total Sales', reportData.totalSales],
    ];

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

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

  const chartData = reportData?.dailyBreakdown || [];
  const periodLabel = {
    '7': 'Last 7 Days',
    '30': 'Last 30 Days',
    '90': 'Last 90 Days',
  }[period] || period + ' Days';

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
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Analytics Dashboard</h1>
                  <p className="text-slate-600 dark:text-slate-400">Comprehensive business insights and performance metrics</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={fetchReports}
                disabled={isRefreshing}
                variant="outline"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Button
                onClick={exportToCSV}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Period Selection */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Report Period:</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: '7', label: '7D' },
                    { value: '30', label: '30D' },
                    { value: '90', label: '90D' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPeriod(opt.value)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                        period === opt.value
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {reportData && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatBox 
                  label="Total Revenue" 
                  value={`$${reportData.totalRevenue.toFixed(2)}`} 
                  icon={<DollarSign className="w-6 h-6" />}
                  trend="up"
                  color="blue"
                />
                <StatBox 
                  label="Total Cost" 
                  value={`$${reportData.totalCost.toFixed(2)}`} 
                  icon={<Package className="w-6 h-6" />}
                  trend="neutral"
                  color="gray"
                />
                <StatBox 
                  label="Net Profit" 
                  value={`$${reportData.totalProfit.toFixed(2)}`} 
                  icon={<TrendingUp className="w-6 h-6" />}
                  trend="up"
                  color="green"
                />
                <StatBox 
                  label="Profit Margin" 
                  value={`${reportData.profitMargin}%`} 
                  icon={<Target className="w-6 h-6" />}
                  trend="up"
                  color="purple"
                />
              </div>

              {/* Revenue Chart */}
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      Revenue Trend
                      <span className="text-sm font-normal text-slate-600 dark:text-slate-400 ml-2">
                        ({periodLabel})
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        style={{ fontSize: '12px' }} 
                        stroke="#64748b"
                        tick={{ fill: '#64748b' }}
                      />
                      <YAxis 
                        style={{ fontSize: '12px' }} 
                        stroke="#64748b"
                        tick={{ fill: '#64748b' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          color: '#1e293b'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="totalRevenue" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                        name="Revenue" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalProfit" 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                        name="Profit" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Two Column Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Breakdown */}
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                        <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      Daily Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {chartData.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BarChart3 className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400">No data available for the selected period</p>
                        </div>
                      ) : (
                        chartData.map((day, idx) => (
                          <div key={idx} className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{day.date}</p>
                                <Badge variant="outline" className="mt-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs">
                                  {day.transactionCount} transactions
                                </Badge>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-slate-900 dark:text-white">${day.totalRevenue.toFixed(2)}</p>
                                <p className="text-sm text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                                  <ArrowUpRight className="w-3 h-3" />
                                  +${day.totalProfit.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-slate-600 dark:text-slate-400">Cost: ${day.totalCost?.toFixed(2) || '0.00'}</div>
                              <div className="text-right text-slate-600 dark:text-slate-400">Margin: {day.profitMargin?.toFixed(1) || '0'}%</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      Top Performing Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {topProducts.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400">No product data available</p>
                        </div>
                      ) : (
                        topProducts.map((product, idx) => (
                          <div key={idx} className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                                  {idx + 1}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{product.productName}</p>
                                  <Badge variant="outline" className="mt-1 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs">
                                    {product.unitsSold} units
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-slate-600 dark:text-slate-400 text-xs">Revenue</p>
                                <p className="font-semibold text-slate-900 dark:text-white">${product.revenue.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-slate-600 dark:text-slate-400 text-xs">Profit</p>
                                <p className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                                  <ArrowUpRight className="w-3 h-3" />
                                  ${product.profit.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary Stats */}
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <SummaryItem 
                      label="Total Transactions" 
                      value={reportData.totalSales} 
                      icon={<Package className="w-4 h-4" />}
                    />
                    <SummaryItem 
                      label="Total Tax" 
                      value={`$${reportData.totalTax.toFixed(2)}`} 
                      icon={<DollarSign className="w-4 h-4" />}
                    />
                    <SummaryItem 
                      label="Total Discount" 
                      value={`$${reportData.totalDiscount.toFixed(2)}`} 
                      icon={<TrendingUp className="w-4 h-4" />}
                    />
                    <SummaryItem 
                      label="Avg. Transaction" 
                      value={`$${(reportData.totalRevenue / Math.max(1, reportData.totalSales)).toFixed(2)}`} 
                      icon={<Target className="w-4 h-4" />}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}

function StatBox({ 
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
    gray: 'from-gray-500 to-slate-500'
  }[color];

  const trendIcons = {
    up: <ArrowUpRight className="w-4 h-4 text-green-500" />,
    down: <ArrowDownRight className="w-4 h-4 text-red-500" />,
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
                {trend === 'up' ? 'Positive' : trend === 'down' ? 'Negative' : 'Neutral'}
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

function SummaryItem({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-4 space-y-3 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          {icon}
        </div>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}