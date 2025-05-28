import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  barcode: { type: String, required: true, unique: true },
  category: { type: String },
  price: { type: Number, required: true },
  company: { type: String, required: true },
  remarks: { type: String },
});

export default mongoose.model("Product",productSchema)
