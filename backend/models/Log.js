import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  company: { type: String, required: true },
  // createdAt: { type: Date, default: Date.now }
});



export default mongoose.model('Log', logSchema);
