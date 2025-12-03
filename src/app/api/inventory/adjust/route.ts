import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import InventoryLog from '@/models/InventoryLog';
import User from '@/models/User';
import { validateRequest } from '@/lib/auth/jwt';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const adjustInventorySchema = z.object({
  productId: z.string(),
  batchNumber: z.string().default(() => uuidv4()),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  costPrice: z.number().min(0),
  type: z.enum(['purchase', 'adjustment', 'return']).default('purchase'),
  reason: z.string().optional(),
  expiryDate: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await validateRequest();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Convert string numbers to actual numbers
    const parsedBody = {
      ...body,
      quantity: typeof body.quantity === 'string' ? parseInt(body.quantity, 10) : body.quantity,
      costPrice: typeof body.costPrice === 'string' ? parseFloat(body.costPrice) : body.costPrice,
    };

    const validatedData = adjustInventorySchema.parse(parsedBody);

    await connectDB();

    const product = await Product.findById(validatedData.productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const previousQuantity = product.batches.reduce(
      (sum: number, batch: any) => sum + batch.quantity,
      0
    );

    const newBatch = {
      batchNumber: validatedData.batchNumber,
      quantity: validatedData.quantity,
      costPrice: validatedData.costPrice,
      expiryDate: validatedData.expiryDate
        ? new Date(validatedData.expiryDate)
        : undefined,
      createdAt: new Date(),
    };

    product.batches.push(newBatch);
    await product.save();

    const newQuantity = previousQuantity + validatedData.quantity;

    const log = new InventoryLog({
      productId: product._id,
      type: validatedData.type,
      quantity: validatedData.quantity,
      previousQuantity,
      newQuantity,
      reason: validatedData.reason || `${validatedData.type} - ${validatedData.batchNumber}`,
      reference: validatedData.batchNumber,
      performedBy: user.userId,
    });

    await log.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Inventory adjusted successfully',
        data: {
          product,
          log,
        },
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

    console.error('Adjust inventory error:', error);
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
    const limit = parseInt(searchParams.get('limit') || '50');
    const date = searchParams.get('date');
    const type = searchParams.get('type');

    const skip = (page - 1) * limit;
    
    // Build query
    let query: any = {};
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }

    const inventoryLogs = await InventoryLog.find(query)
      .populate('productId', 'name sku')
      .populate('performedBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await InventoryLog.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: inventoryLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get inventory logs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
