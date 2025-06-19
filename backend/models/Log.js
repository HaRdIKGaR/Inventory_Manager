import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
  company: { type: String, required: true }
});

export default mongoose.model('Log', logSchema);
