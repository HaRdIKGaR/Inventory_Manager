import mongoose from 'mongoose'

const inventorySchema = new mongoose.Schema({
    barcode: { type: String, required: true, unique: true },
    productName:{type:String,required:true},
  company: { type: String, required: true },
  category:{type:String, required:true},
  quantity: { type: Number, required: true, default: 0 },
  updatedAt: { type: Date, default: Date.now },
  });

  inventorySchema.index({ barcode: 1, company: 1 }, { unique: true });

export default mongoose.model('Inventory', inventorySchema);