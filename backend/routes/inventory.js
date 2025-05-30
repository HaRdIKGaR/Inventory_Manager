import express from 'express';
const router = express.Router();
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
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

    const existing = await Inventory.findOne({ barcode, company });
    
    if (existing) {
      existing.productName = name;
      existing.category = category;
      console.log("product found")
      existing.quantity += parseInt(quantity);
      existing.updatedAt = new Date();
      await existing.save();
      return res.status(200).json({ message: 'Stock updated', inventory: existing });
    }

    const newEntry = new Inventory({ barcode, quantity, company });
    newEntry.productName = name;
    newEntry.category = category;
    console.log("creating new entry")
    await newEntry.save();
    res.status(201).json({ message: 'Stock entry created', inventory: newEntry });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }});

export default router;
