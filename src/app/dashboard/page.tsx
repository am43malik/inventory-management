


'use client';

import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useEffect, useState } from 'react';
import { api, getApiClient } from '@/lib/api-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { TrendingUp, Package, ShoppingCart, DollarSign, TrendingDown, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';

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
  const [range, setRange] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('today');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // map range to API params
        // Build requests based on range
        const periodParam =
          range === 'today' ? '1'
          : range === 'week' ? '7'
          : range === 'month' ? '30'
          : range === 'year' ? '365'
          : '30';

        const [daily, period, top] = await Promise.all([
          api.getDailyReport(1),
          range === 'custom' && startDate && endDate
            ? getApiClient().get('/reports/period', { params: { startDate, endDate } })
            : api.getPeriodReport(periodParam),
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
  }, [range, startDate, endDate]);

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
            <div className="flex flex-col gap-2">
              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-700/50 px-2 py-1">
                <Select value={range} onValueChange={(val: any) => setRange(val)}>
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {range === 'custom' && (
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e: any) => setStartDate(e.target.value)}
                  />
                  <span className="text-slate-600 dark:text-slate-400">to</span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e: any) => setEndDate(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              label="Revenue"
              value={`₹${(periodReport?.totalRevenue ?? 0).toFixed(2)}`}
              trend={12}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Profit"
              value={`₹${(periodReport?.totalProfit ?? 0).toFixed(2)}`}
              trend={8}
              color="bg-gradient-to-br from-orange-500 to-orange-600"
            />
            <StatCard
              icon={<ShoppingCart className="w-6 h-6" />}
              label="Sales"
              value={periodReport?.totalSales ?? '0'}
              trend={5}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              icon={<Package className="w-6 h-6" />}
              label="Units Sold"
              value={periodReport?.totalUnitsSold ?? dailyReport?.totalUnitsSold ?? '0'}
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
                  {range === 'today' && 'Revenue Trend (Today)'}
                  {range === 'week' && 'Revenue Trend (This Week)'}
                  {range === 'month' && 'Revenue Trend (This Month)'}
                  {range === 'year' && 'Revenue Trend (This Year)'}
                  {range === 'custom' && 'Revenue Trend (Custom Range)'}
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
                {range === 'today' && 'Performance Summary (Today)'}
                {range === 'week' && 'Performance Summary (This Week)'}
                {range === 'month' && 'Performance Summary (This Month)'}
                {range === 'year' && 'Performance Summary (This Year)'}
                {range === 'custom' && 'Performance Summary (Custom Range)'}
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
                  value={`₹${periodReport?.totalProfit?.toFixed(2)}`} 
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
                  value={`₹${periodReport?.totalTax?.toFixed(2)}`} 
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