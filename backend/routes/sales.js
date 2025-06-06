import express from 'express';
import Sale from '../models/Sales.js';
import auth from '../middleware/auth.js';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';

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

router.get('/category/:category', auth, async (req, res) => {
  try {
    const company = req.user.company;
    let category = req.params.category;
    const days = parseInt(req.query.days) || 7; // default to last 7 days

    if (!category || typeof category !== 'string')
      return res.status(400).json({ error: 'Invalid category parameter' });

    // Case-insensitive, partial match
    category = category.toLowerCase();
    const categoryRegex = new RegExp(category, 'i');

    // Get product barcodes in matching category
    const productsInCategory = await Product.find({
      company,
      category: { $regex: categoryRegex }
    }).lean();

    if (productsInCategory.length === 0) return res.json([]);

    const barcodeToName = {};
    const barcodes = productsInCategory.map(p => {
      barcodeToName[p.barcode] = p.productName;
      return p.barcode;
    });

    // Calculate date threshold
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    // Aggregate sales data within date range
    const sales = await Sale.aggregate([
      { $match: { date: { $gte: fromDate } } },
      { $unwind: "$entries" },
      { $match: { "entries.barcode": { $in: barcodes } } },
      {
        $group: {
          _id: "$entries.barcode",
          totalSold: { $sum: "$entries.quantity" },
          revenue: { $sum: { $multiply: ["$entries.quantity", "$entries.price"] } }
        }
      }
    ]);

    const result = sales.map(s => ({
      product: barcodeToName[s._id] || "Unknown",
      quantity: s.totalSold,
      revenue: s.revenue
    }));

    res.json(result);

  } catch (err) {
    console.error('Error in /category/:category:', err);
    res.status(500).json({ error: 'Failed to fetch sales by category' });
  }
});

router.get('/daily', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const company = req.user.company;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const sales = await Sale.aggregate([
      { $match: { date: { $gte: fromDate } } },
      { $unwind: "$entries" },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
          },
          totalRevenue: { $sum: { $multiply: ["$entries.price", "$entries.quantity"] } },
          totalQuantity: { $sum: "$entries.quantity" }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);

    const result = sales.map(s => ({
      date: s._id.day,
      revenue: s.totalRevenue,
      quantity: s.totalQuantity
    }));

    res.json(result);
  } catch (err) {
    console.error("Daily sales aggregation error:", err);
    res.status(500).json({ error: "Failed to fetch daily sales" });
  }
});



export default router;
