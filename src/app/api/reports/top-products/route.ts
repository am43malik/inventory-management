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
    const limit = parseInt(searchParams.get('limit') || '10');

    const sales = await Sale.find({ status: 'completed' }).sort({
      createdAt: -1,
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

    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        topProducts,
        totalUnique: productSalesMap.size,
      },
    });
  } catch (error) {
    console.error('Get top products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
