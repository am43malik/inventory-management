import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISaleItem extends Document {
  productId: Types.ObjectId;
  productName: string;
  sku: string;
  quantity: number;
  salePrice: number;
  costPrice: number;
  subtotal: number;
}

export interface ISale extends Document {
  items: ISaleItem[];
  subtotal: number;
  taxAmount: number;
  taxPercentage: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'cheque' | 'other';
  cashier: Types.ObjectId;
  notes?: string;
  status: 'completed' | 'cancelled' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const SaleItemSchema = new Schema<ISaleItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  salePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const SaleSchema = new Schema<ISale>(
  {
    items: [SaleItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    taxPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'cheque', 'other'],
      required: true,
    },
    cashier: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['completed', 'cancelled', 'pending'],
      default: 'completed',
    },
  },
  { timestamps: true }
);

SaleSchema.index({ cashier: 1, createdAt: -1 });
SaleSchema.index({ createdAt: -1 });
SaleSchema.index({ status: 1 });

export default mongoose.models.Sale ||
  mongoose.model<ISale>('Sale', SaleSchema);
