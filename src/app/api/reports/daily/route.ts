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
    const days = parseInt(searchParams.get('days') || '1');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      status: 'completed',
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const productSalesMap = new Map();

    for (const sale of sales) {
      for (const item of sale.items) {
        const key = item.productId;
        if (!productSalesMap.has(key)) {
          productSalesMap.set(key, {
            productId: item.productId,
            productName: item.productName,
            sku: item.sku,
            unitsSold: 0,
            revenue: 0,
            cost: 0,
            profit: 0,
          });
        }

        const entry = productSalesMap.get(key);
        entry.unitsSold += item.quantity;
        entry.revenue += item.subtotal;
        entry.cost += item.quantity * item.costPrice;
        entry.profit = entry.revenue - entry.cost;
      }
    }

    const dailyReport = {
      date: new Date().toISOString().split('T')[0],
      periodDays: days,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + sale.total, 0),
      totalTax: sales.reduce((sum, sale) => sum + sale.taxAmount, 0),
      totalDiscount: sales.reduce((sum, sale) => sum + sale.discount, 0),
      totalCost: Array.from(productSalesMap.values()).reduce(
        (sum, item) => sum + item.cost,
        0
      ),
      totalProfit: Array.from(productSalesMap.values()).reduce(
        (sum, item) => sum + item.profit,
        0
      ),
      totalUnitsSold: Array.from(productSalesMap.values()).reduce(
        (sum, item) => sum + item.unitsSold,
        0
      ),
      productBreakdown: Array.from(productSalesMap.values()).sort(
        (a, b) => b.revenue - a.revenue
      ),
    };

    return NextResponse.json({
      success: true,
      data: dailyReport,
    });
  } catch (error) {
    console.error('Get daily report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
