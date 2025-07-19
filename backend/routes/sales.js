import express from 'express';
import Sale from '../models/Sales.js';
import auth from '../middleware/auth.js';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import LowStockAlert from '../models/Alert.js';
import Log from '../models/Log.js'

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

    const today = new Date();
    const d7 = new Date(today); d7.setDate(today.getDate() - 7);
    const d14 = new Date(today); d14.setDate(today.getDate() - 14);
    const d30 = new Date(today); d30.setDate(today.getDate() - 30);

    for (const entry of entries) {
      const { barcode, quantity, price, product, remarks } = entry;

      const inventory = await Inventory.findOne({ barcode, company }).session(session);
      if (!inventory) throw new Error(`No inventory record for ${barcode}`);

      if (inventory.quantity < quantity)
        throw new Error(`Insufficient stock for ${barcode}`);

      inventory.quantity -= quantity;
      await inventory.save({ session });

      const total = quantity * price;
      totalAmount += total;

      saleEntries.push({ barcode, quantity, price, product, remarks });

      // --- Dynamic Threshold Calculation ---
     const salesAggregation = await Sale.aggregate([
  {
    $match: {
      "entries.barcode": barcode,
      company,
      date: { $gte: thirtyDaysAgo }  // Get all in one go
    }
  },
  { $unwind: "$entries" },
  { $match: { "entries.barcode": barcode } },
  {
    $facet: {
      avg7: [
        { $match: { date: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: null,
            totalQty: { $sum: "$entries.quantity" }
          }
        }
      ],
      avg14: [
        { $match: { date: { $gte: fourteenDaysAgo } } },
        {
          $group: {
            _id: null,
            totalQty: { $sum: "$entries.quantity" }
          }
        }
      ],
      avg30: [
        {
          $group: {
            _id: null,
            totalQty: { $sum: "$entries.quantity" }
          }
        }
      ]
    }
  }
]);


     const avg7 = salesAggregation[0].avg7[0]?.totalQty || 0;
const avg14 = salesAggregation[0].avg14[0]?.totalQty || 0;
const avg30 = salesAggregation[0].avg30[0]?.totalQty || 0;



      const weightedAvg = (avg7 * 0.5 + avg14 * 0.3 + avg30 * 0.2)/3;
      const bufferDays = 5;
      const threshold = weightedAvg * bufferDays;

      
      // --- Create/Update/Delete Low Stock Alert ---
      if (inventory.quantity < threshold || inventory.quantity === 0) {
  await LowStockAlert.findOneAndUpdate(
    { barcode, company },
    {
      barcode,
      company,
      productName: inventory.productName,
      currentQuantity: inventory.quantity,
      dynamicThreshold: threshold.toFixed(2),
      updatedAt: new Date()
    },
    { upsert: true, new: true }
  );

  // Log the low stock event
  await Log.create({
    user: req.user.name,
    action: 'Low Stock Alert',
    details: `Product '${inventory.productName}' fell below threshold (${inventory.quantity}/${threshold.toFixed(2)}).`,
    company: req.user.company
  });

} else {
  await LowStockAlert.deleteOne({ barcode, company });
}
    }

    if (Math.abs(totalAmount - clientTotal) > 0.01)
      throw new Error('Total mismatch between client and server.');

    const sale = new Sale({
  company, // <-- include company here
  entries: saleEntries,
  paymentMethod,
  total: totalAmount,
});

    await sale.save({ session });
    await Log.create({
  user: req.user.name,
  action: 'Sale Recorded',
  details: `Sold ${entries.length} product(s) worth ₹${totalAmount.toFixed(2)}`,
  company: req.user.company
});
    await session.commitTransaction();

    res.status(201).json({
      message: 'Sale recorded and inventory updated'
    });
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

router.get('/summary', auth, async (req, res) => {
  try {
    const company = req.user.company;
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total sales today for the company
    const todaySales = await Sale.aggregate([
      { $match: { date: { $gte: startOfToday }, company } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    // Total sales this month for the company
    const monthSales = await Sale.aggregate([
      { $match: { date: { $gte: startOfMonth }, company } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    res.json({
      today: todaySales[0]?.total || 0,
      month: monthSales[0]?.total || 0
    });
  } catch (err) {
    console.error("Sales summary error:", err);
    res.status(500).json({ error: "Failed to fetch sales summary." });
  }
});


router.get('/payment-methods',auth, async (req, res) => {
   try {
    const result = await Sale.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          revenue: { $sum: "$total" }
        }
      },
      {
        $project: {
          method: "$_id",
          revenue: 1,
          _id: 0
        }
      }
    ]);

    res.json(result);
  } catch (err) {
    console.error("Failed to get payment method data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



export default router;
