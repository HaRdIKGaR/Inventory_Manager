import express from 'express';
import LowStockAlert from '../models/Alert.js';
import Product from '../models/Product.js';

const router = express.Router();

// Utility to normalize category to Title Case
const toTitleCase = (str) =>
  str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

router.get('/', async (req, res) => {
  try {
    // Fetch all alerts
    const alerts = await LowStockAlert.find({});
    
    // Get barcodes from alerts
    const barcodes = alerts.map(alert => alert.barcode);
    
    // Fetch product info (including category) for those barcodes
    const products = await Product.find({ barcode: { $in: barcodes } });

    // Map barcodes to normalized categories
    const barcodeToCategory = {};
    products.forEach(product => {
      const category = product.category ? toTitleCase(product.category) : "Uncategorized";
      barcodeToCategory[product.barcode] = category;
    });

    // Group alerts by normalized category
    const grouped = {};
    alerts.forEach(alert => {
      const category = barcodeToCategory[alert.barcode] || "Uncategorized";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push({
        barcode: alert.barcode,
        productName: alert.productName,
        currentQuantity: alert.currentQuantity,
        dynamicThreshold: alert.dynamicThreshold,
        company: alert.company
      });
    });

    res.json(grouped); // Object where each key is a normalized category
  } catch (error) {
    console.error("Error fetching low stock alerts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
