import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import InventoryLog from '@/models/InventoryLog';
import { validateRequest } from '@/lib/auth/jwt';
import { z } from 'zod';

const stockOutSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  reason: z.string().optional(),
  reference: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await validateRequest();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = stockOutSchema.parse(body);

    await connectDB();

    const product = await Product.findById(validatedData.productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Calculate current quantity
    const currentQuantity = product.batches.reduce(
      (sum: number, batch: any) => sum + batch.quantity,
      0
    );

    // Check if sufficient stock available
    if (currentQuantity < validatedData.quantity) {
      return NextResponse.json(
        {
          error: 'Insufficient stock',
          available: currentQuantity,
          requested: validatedData.quantity,
        },
        { status: 400 }
      );
    }

    // Deduct from batches (FIFO - First In First Out)
    let quantityToRemove = validatedData.quantity;
    for (let i = 0; i < product.batches.length && quantityToRemove > 0; i++) {
      if (product.batches[i].quantity > 0) {
        const deductedQuantity = Math.min(
          product.batches[i].quantity,
          quantityToRemove
        );
        product.batches[i].quantity -= deductedQuantity;
        quantityToRemove -= deductedQuantity;
      }
    }

    // Remove empty batches
    product.batches = product.batches.filter((batch: any) => batch.quantity > 0);

    await product.save();

    // Calculate new quantity
    const newQuantity = product.batches.reduce(
      (sum: number, batch: any) => sum + batch.quantity,
      0
    );

    // Log the inventory change
    await InventoryLog.create({
      productId: validatedData.productId,
      type: 'adjustment',
      quantity: validatedData.quantity,
      previousQuantity: currentQuantity,
      newQuantity,
      reason: validatedData.reason || 'Stock out',
      reference: validatedData.reference,
      performedBy: user.userId,
    });

    return NextResponse.json({
      success: true,
      message: 'Stock removed successfully',
      data: {
        productId: product._id,
        productName: product.name,
        quantityRemoved: validatedData.quantity,
        previousQuantity: currentQuantity,
        newQuantity,
      },
    });
  } catch (error) {
    console.error('Stock out error:', error);
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
