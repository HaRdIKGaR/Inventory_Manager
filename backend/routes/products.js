import express from 'express';
const router = express.Router();
import Product from '../models/Product.js';
import auth from '../middleware/auth.js'; 
import Log from '../models/Log.js'

router.post("/", auth, async (req, res) => {
  const { productName, barcode, category, price, remarks } = req.body;
  

  if (!barcode || !productName || !price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existing = await Product.findOne({ barcode, company: req.user.company });
    if (existing) {
      console.log(existing);
      return res.status(409).json({ message: 'Product with this barcode already exists' });
    }

    const product = new Product({
      productName,
      barcode,
      category,
      price,
      company: req.user.company,
      remarks,
    });

    await product.save();
    
    await Log.create({
  user: req.user.name,
  action: `${productName} registered`,
  details: `Registered  ${productName}}`,
  company: req.user.company
});
    res.status(201).json({ message: 'Product registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
