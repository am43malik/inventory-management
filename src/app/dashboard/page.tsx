


'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { TrendingUp, Package, ShoppingCart, DollarSign, TrendingDown, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface DailyReport {
  totalRevenue: number;
  totalProfit: number;
  totalUnitsSold: number;
  totalSales: number;
}

export default function DashboardPage() {
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [periodReport, setPeriodReport] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [daily, period, top] = await Promise.all([
          api.getDailyReport(1),
          api.getPeriodReport('30'),
          api.getTopProducts(5),
        ]);

        setDailyReport(daily.data.data);
        setPeriodReport(period.data.data);
        setTopProducts(top.data.data.topProducts);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-80 rounded-2xl" />
              <Skeleton className="h-80 rounded-2xl" />
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  const chartData = periodReport?.dailyBreakdown || [];
  const profitData = topProducts.slice(0, 5).map((p) => ({
    name: p.productName,
    profit: p.profit,
  }));

  return (
    <ProtectedLayout>
      <div className="w-full min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-6">
        <div className="w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                Welcome back! Here's your business overview.
              </p>
            </div>
            <div className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <span className="text-sm text-slate-600 dark:text-slate-400">Last 30 days</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              label="Today's Revenue"
              value={`₹${dailyReport?.totalRevenue?.toFixed(2) || '0.00'}`}
              trend={12}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Today's Profit"
              value={`₹${dailyReport?.totalProfit?.toFixed(2) || '0.00'}`}
              trend={8}
              color="bg-gradient-to-br from-orange-500 to-orange-600"
            />
            <StatCard
              icon={<ShoppingCart className="w-6 h-6" />}
              label="Today's Sales"
              value={dailyReport?.totalSales || '0'}
              trend={5}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              icon={<Package className="w-6 h-6" />}
              label="Units Sold"
              value={dailyReport?.totalUnitsSold || '0'}
              trend={-2}
              color="bg-gradient-to-br from-cyan-500 to-cyan-600"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-linear-to-r from-purple-500/10 to-blue-500/10 border-b border-slate-200/50 dark:border-slate-700/50">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  Revenue Trend (30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12} 
                      stroke="hsl(var(--foreground))" 
                      opacity={0.7}
                    />
                    <YAxis 
                      fontSize={12} 
                      stroke="hsl(var(--foreground))" 
                      opacity={0.7}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(8px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalRevenue" 
                      stroke="url(#revenueGradient)" 
                      strokeWidth={3} 
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-linear-to-r from-orange-500/10 to-amber-500/10 border-b border-slate-200/50 dark:border-slate-700/50">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  Top Products by Profit
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={profitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12} 
                      stroke="hsl(var(--foreground))" 
                      opacity={0.7}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      fontSize={12} 
                      stroke="hsl(var(--foreground))" 
                      opacity={0.7}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(8px)'
                      }}
                    />
                    <Bar 
                      dataKey="profit" 
                      radius={[8, 8, 0, 0]}
                    >
                      {profitData.map((entry, index) => (
                        <defs key={index}>
                          <linearGradient id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#f59e0b" />
                          </linearGradient>
                        </defs>
                      ))}
                      {profitData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#barGradient${index})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Section */}
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-linear-to-r from-cyan-500/10 to-blue-500/10 border-b border-slate-200/50 dark:border-slate-700/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Eye className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                30-Day Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryItem 
                  label="Total Revenue" 
                  value={`₹${periodReport?.totalRevenue?.toFixed(2)}`} 
                  trend={12}
                />
                <SummaryItem
                  label="Total Cost"
                  value={`₹${periodReport?.totalCost?.toFixed(2)}`}
                  trend={-8.7}
                />
                <SummaryItem 
                  label="Total Profit" 
                  value={`$${periodReport?.totalProfit?.toFixed(2)}`} 
                  trend={22.4}
                />
                <SummaryItem 
                  label="Profit Margin" 
                  value={`${periodReport?.profitMargin}%`} 
                  trend={6.1}
                />
                <SummaryItem 
                  label="Total Sales" 
                  value={periodReport?.totalSales} 
                  trend={12.8}
                />
                <SummaryItem 
                  label="Avg Daily Sales" 
                  value={periodReport?.averageDailySales?.toFixed(1)} 
                  trend={4.3}
                />
                <SummaryItem 
                  label="Total Tax" 
                  value={`$${periodReport?.totalTax?.toFixed(2)}`} 
                  trend={9.6}
                />
                <SummaryItem 
                  label="Total Discount" 
                  value={`₹${periodReport?.totalDiscount?.toFixed(2)}`} 
                  trend={-3.2}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
}

function StatCard({ 
  icon, 
  label, 
  value,
  trend,
  color 
}: { 
  icon: any
  label: string
  value: string | number
  trend?: number
  color: string
}) {
  const isPositive = trend && trend >= 0;

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
            <p className="text-3xl font-bold bg-linear-to-br from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              {value}
            </p>
            {trend !== undefined && (
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  isPositive 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }`}>
                  {isPositive ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {Math.abs(trend)}%
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">vs yesterday</span>
              </div>
            )}
          </div>
          <div className={`p-3 ${color} rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryItem({ 
  label, 
  value,
  trend
}: { 
  label: string
  value: string | number
  trend?: number
}) {
  const isPositive = trend && trend >= 0;

  return (
    <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-4 space-y-3 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold bg-linear-to-br from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          {value}
        </p>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {isPositive ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}