import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Sale from '@/models/Sale';
import { validateRequest } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const user = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // 7, 30, 90
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      status: 'completed',
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Group by date
    const dailyData = new Map();

    for (const sale of sales) {
      const date = new Date(sale.createdAt);
      const dateKey = date.toISOString().split('T')[0];

      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, {
          date: dateKey,
          totalSales: 0,
          totalRevenue: 0,
          totalCost: 0,
          totalProfit: 0,
          totalTax: 0,
          totalDiscount: 0,
          unitsSold: 0,
          transactionCount: 0,
        });
      }

      const day = dailyData.get(dateKey);
      day.totalRevenue += sale.total;
      day.totalTax += sale.taxAmount;
      day.totalDiscount += sale.discount;
      day.transactionCount += 1;

      for (const item of sale.items) {
        day.totalCost += item.quantity * item.costPrice;
        day.unitsSold += item.quantity;
      }

      day.totalProfit = day.totalRevenue - day.totalCost;
    }

    const report = {
      period: `${days} days`,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + sale.total, 0),
      totalCost: Array.from(dailyData.values()).reduce(
        (sum, day) => sum + day.totalCost,
        0
      ),
      totalTax: sales.reduce((sum, sale) => sum + sale.taxAmount, 0),
      totalDiscount: sales.reduce((sum, sale) => sum + sale.discount, 0),
      totalProfit: 0,
      averageDailySales: 0,
      profitMargin: 0,
      dailyBreakdown: Array.from(dailyData.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    };

    report.totalProfit = report.totalRevenue - report.totalCost;
    report.averageDailySales = report.totalSales / days;
    report.profitMargin = 
      report.totalRevenue > 0
        ? parseFloat(((report.totalProfit / report.totalRevenue) * 100).toFixed(2))
        : 0;

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Get period report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
