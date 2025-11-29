import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import InventoryLog from '@/models/InventoryLog';
import { validateRequest } from '@/lib/auth/jwt';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const stockInSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  costPrice: z.number().min(0),
  batchNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await validateRequest();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = stockInSchema.parse(body);

    await connectDB();

    const product = await Product.findById(validatedData.productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Calculate previous quantity
    const previousQuantity = product.batches.reduce(
      (sum: number, batch: any) => sum + batch.quantity,
      0
    );

    // Create new batch
    const newBatch = {
      batchNumber: validatedData.batchNumber || uuidv4(),
      quantity: validatedData.quantity,
      costPrice: validatedData.costPrice,
      expiryDate: validatedData.expiryDate
        ? new Date(validatedData.expiryDate)
        : undefined,
      createdAt: new Date(),
    };

    // Add batch to product
    product.batches.push(newBatch);
    await product.save();

    // Calculate new quantity
    const newQuantity = product.batches.reduce(
      (sum: number, batch: any) => sum + batch.quantity,
      0
    );

    // Log the inventory change
    await InventoryLog.create({
      productId: validatedData.productId,
      type: 'purchase',
      quantity: validatedData.quantity,
      previousQuantity,
      newQuantity,
      reason: validatedData.reason || 'Stock in',
      reference: newBatch.batchNumber,
      performedBy: user.userId,
    });

    return NextResponse.json({
      success: true,
      message: 'Stock added successfully',
      data: {
        productId: product._id,
        productName: product.name,
        quantity: validatedData.quantity,
        previousQuantity,
        newQuantity,
        batchNumber: newBatch.batchNumber,
      },
    });
  } catch (error) {
    console.error('Stock in error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
