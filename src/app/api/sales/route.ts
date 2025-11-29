import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Sale from '@/models/Sale';
import Product from '@/models/Product';
import InventoryLog from '@/models/InventoryLog';
import User from '@/models/User';
import { validateRequest } from '@/lib/auth/jwt';
import { Types } from 'mongoose';
import { z } from 'zod';

const saleItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  salePrice: z.number().min(0),
});

const createSaleSchema = z.object({
  items: z.array(saleItemSchema).min(1),
  taxPercentage: z.number().min(0).max(100).optional().default(0),
  discount: z.number().min(0).optional().default(0),
  paymentMethod: z.enum(['cash', 'card', 'cheque', 'other']),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createSaleSchema.parse(body);

    await connectDB();

    let subtotal = 0;
    const saleItems = [];

    for (const item of validatedData.items) {
      if (!Types.ObjectId.isValid(item.productId)) {
        return NextResponse.json(
          { error: `Invalid product ID: ${item.productId}` },
          { status: 400 }
        );
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        );
      }

      const totalBatchQuantity = product.batches.reduce(
        (sum: number, batch: any) => sum + batch.quantity,
        0
      );

      if (totalBatchQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name}. Available: ${totalBatchQuantity}`,
          },
          { status: 400 }
        );
      }

      const itemSubtotal = item.quantity * item.salePrice;
      subtotal += itemSubtotal;

      saleItems.push({
        productId: product._id.toString(),
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        salePrice: item.salePrice,
        costPrice: product.costPrice,
        subtotal: itemSubtotal,
      });
    }

    const taxAmount = subtotal * (validatedData.taxPercentage / 100);
    const total = subtotal + taxAmount - validatedData.discount;

    const sale = new Sale({
      items: saleItems,
      subtotal,
      taxAmount,
      taxPercentage: validatedData.taxPercentage,
      discount: validatedData.discount,
      total,
      paymentMethod: validatedData.paymentMethod,
      cashier: user.userId,
      notes: validatedData.notes,
      status: 'completed',
    });

    await sale.save();

    // Deduct inventory
    for (const saleItem of saleItems) {
      const product = await Product.findById(saleItem.productId);
      if (!product) continue;

      let remainingQuantity = saleItem.quantity;
      const previousQuantity = product.batches.reduce(
        (sum: number, batch: any) => sum + batch.quantity,
        0
      );

      // Deduct from batches (FIFO)
      for (let i = 0; i < product.batches.length && remainingQuantity > 0; i++) {
        const deductQuantity = Math.min(
          product.batches[i].quantity,
          remainingQuantity
        );
        product.batches[i].quantity -= deductQuantity;
        remainingQuantity -= deductQuantity;
      }

      // Remove empty batches
      product.batches = product.batches.filter((batch: any) => batch.quantity > 0);
      await product.save();

      const newQuantity = product.batches.reduce(
        (sum: number, batch: any) => sum + batch.quantity,
        0
      );

      // Create inventory log
      const log = new InventoryLog({
        productId: product._id,
        type: 'sale',
        quantity: saleItem.quantity,
        previousQuantity,
        newQuantity,
        reason: `Sale - ${sale._id}`,
        reference: sale._id.toString(),
        performedBy: user.userId,
      });

      await log.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Sale created successfully',
        data: await Sale.findById(sale._id).populate('cashier', 'name email'),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Create sale error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query: any = { status: 'completed' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const skip = (page - 1) * limit;

    const sales = await Sale.find(query)
      .populate('cashier', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Sale.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: sales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get sales error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
