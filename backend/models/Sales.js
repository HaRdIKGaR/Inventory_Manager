import mongoose from 'mongoose';

const saleEntrySchema = new mongoose.Schema({
  product: { type: String, required: true },
  barcode: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  remarks: { type: String }
});

const saleSchema = new mongoose.Schema({
  company: { type: String, required: true }, // <-- Add this line
  entries: {
    type: [saleEntrySchema],
    required: true,
    validate: [arr => arr.length > 0, 'At least one entry is required.']
  },
  paymentMethod: { type: String, required: true },
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});


export default mongoose.model('Sale', saleSchema);
