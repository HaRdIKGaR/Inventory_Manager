import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'inventory manager', 'cashier'], required: true },
  company: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
