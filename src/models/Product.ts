import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBatch extends Document {
  batchNumber: string;
  quantity: number;
  expiryDate?: Date;
  costPrice: number;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: Types.ObjectId;
  description?: string;
  costPrice: number;
  salePrice: number;
  unit: string;
  image?: string;
  batches: IBatch[];
  minStock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema = new Schema<IBatch>({
  batchNumber: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  expiryDate: {
    type: Date,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      default: 'pcs',
    },
    image: {
      type: String,
    },
    batches: [BatchSchema],
    minStock: {
      type: Number,
      default: 10,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ProductSchema.index({ sku: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: 'text', sku: 'text' });

export default mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema);
