import express from 'express';
const router = express.Router();
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import LowStockAlert from '../models/Alert.js';
import Sale from '../models/Sales.js'; 
import auth from '../middleware/auth.js'; 

// GET: Fetch all inventory
router.get("/", auth, async (req, res) => {
  try {
    const company = req.user.company;
    const inventory = await Inventory.find({ company }).lean();

    const detailedInventory = await Promise.all(inventory.map(async (item) => {
      const product = await Product.findOne({ barcode: item.barcode, company }).lean();
      return {
        ...item,
        productName: product?.productName || 'Unknown Product',
        category: product?.category || '',
        price: product?.price || 0
      };
    }));

    res.json(detailedInventory);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

//GET: Retrieve Product Using Barcode
router.get('/barcode/:barcode',auth, async (req, res) => {
  try {
    const company = req.user.company;
    const product = await Product.findOne({ barcode: req.params.barcode,company }).lean();
    if (!product) return res.status(404).json({ error: 'Product not Found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// POST: Add stock
router.post("/", auth, async (req, res) => {
  const { barcode, quantity } = req.body;
  const company = req.user.company;

  if (!barcode || quantity == null) {
    return res.status(400).json({ message: 'Barcode and quantity are required' });
  }

  try {
    const product = await Product.findOne({ barcode, company });
    if (!product) {
      return res.status(404).json({ message: 'Product not found in your company' });
    }

    const name = product.productName;
    const category = product.category;

    let inventory = await Inventory.findOne({ barcode, company });

    if (inventory) {
      inventory.productName = name;
      inventory.category = category;
      inventory.quantity += parseInt(quantity);
      inventory.updatedAt = new Date();
      await inventory.save();
    } else {
      inventory = new Inventory({ barcode, quantity, company, productName: name, category });
      await inventory.save();
    }

    // === Dynamic Threshold Logic ===
    const today = new Date();
    const d7 = new Date(today); d7.setDate(today.getDate() - 7);
    const d14 = new Date(today); d14.setDate(today.getDate() - 14);
    const d30 = new Date(today); d30.setDate(today.getDate() - 30);

    const getTotal = async (from, to) => {
      const agg = await Sale.aggregate([
        { $match: { createdAt: { $gte: from, $lt: to }, "entries.barcode": barcode, company } },
        { $unwind: "$entries" },
        { $match: { "entries.barcode": barcode } },
        { $group: { _id: null, total: { $sum: "$entries.quantity" } } }
      ]);
      return agg[0]?.total || 0;
    };

    const avg7 = (await getTotal(d7, today)) / 7;
    const avg14 = (await getTotal(d14, d7)) / 7;
    const avg30 = (await getTotal(d30, d14)) / 15;

    const weightedAvg = avg7 * 0.5 + avg14 * 0.3 + avg30 * 0.2;
    const bufferDays = 5;
    const threshold = weightedAvg * bufferDays;

    if (inventory.quantity < threshold) {
      // Create or update alert
      await LowStockAlert.findOneAndUpdate(
        { barcode, company },
        {
          barcode,
          company,
          productName: name,
          currentQuantity: inventory.quantity,
          dynamicThreshold: threshold.toFixed(2),
          lastChecked: new Date()
        },
        { upsert: true, new: true }
      );
    } else {
      // Remove alert if exists
      await LowStockAlert.deleteOne({ barcode, company });
    }

    res.status(inventory ? 200 : 201).json({
      message: inventory ? 'Stock updated' : 'Stock entry created',
      inventory
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
