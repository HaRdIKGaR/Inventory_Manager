import express from 'express';
import Sale from '../models/Sales.js';
import auth from '../middleware/auth.js';
import Inventory from '../models/Inventory.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { entries, paymentMethod, total: clientTotal } = req.body;

  if (!Array.isArray(entries) || entries.length === 0 || !paymentMethod)
    return res.status(400).json({ error: 'Incomplete sales data' });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const company = req.user.company;
    const saleEntries = [];
    let totalAmount = 0;

    for (const entry of entries) {
      const { barcode, quantity, price, product, remarks } = entry;

      const inventory = await Inventory.findOne({ barcode, company }).session(session);
      
      if (inventory.quantity < quantity)
        throw new Error(`Insufficient stock for ${barcode}`);

      inventory.quantity -= quantity;
      await inventory.save({ session });

      const total = quantity * price;
      totalAmount += total;

      saleEntries.push({ barcode, quantity, price, product, remarks });
    }

    if (Math.abs(totalAmount - clientTotal) > 0.01)
      throw new Error('Total mismatch between client and server.');

    const sale = new Sale({
      entries: saleEntries,
      paymentMethod,
      total: totalAmount,
    });

    await sale.save({ session });
    await session.commitTransaction();

    res.status(201).json({ message: 'Sale recorded and inventory updated' });
  } catch (err) {
    await session.abortTransaction();
    console.error('Sale error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

export default router;
