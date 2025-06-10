import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  barcode: String,
  productName: String,
  currentQuantity: Number,
  dynamicThreshold: Number,
  company: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('LowStockAlert',AlertSchema);
