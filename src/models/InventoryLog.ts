import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IInventoryLog extends Document {
  productId: Types.ObjectId;
  type: 'purchase' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  reference?: string;
  performedBy: Types.ObjectId;
  createdAt: Date;
}

const InventoryLogSchema = new Schema<IInventoryLog>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    type: {
      type: String,
      enum: ['purchase', 'sale', 'adjustment', 'return'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    reference: {
      type: String,
      trim: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

InventoryLogSchema.index({ productId: 1, createdAt: -1 });
InventoryLogSchema.index({ type: 1, createdAt: -1 });

export default mongoose.models.InventoryLog ||
  mongoose.model<IInventoryLog>('InventoryLog', InventoryLogSchema);
