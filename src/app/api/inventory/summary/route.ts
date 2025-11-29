import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { validateRequest } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const user = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const products = await Product.find({ isActive: true })
      .select('name sku category minStock batches')
      .sort({ createdAt: -1 });

    const inventorySummary = products.map((product) => {
      const totalQuantity = product.batches.reduce(
        (sum: number, batch: any) => sum + batch.quantity,
        0
      );

      const isLowStock = totalQuantity <= product.minStock;

      return {
        productId: product._id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        currentStock: totalQuantity,
        minStock: product.minStock,
        isLowStock,
        batches: product.batches.map((batch: any) => ({
          batchNumber: batch.batchNumber,
          quantity: batch.quantity,
          costPrice: batch.costPrice,
          expiryDate: batch.expiryDate,
        })),
      };
    });

    const lowStockProducts = inventorySummary.filter((item) => item.isLowStock);

    return NextResponse.json({
      success: true,
      data: {
        summary: inventorySummary,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        totalProducts: products.length,
      },
    });
  } catch (error) {
    console.error('Get inventory summary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
