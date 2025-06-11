import express from 'express';
import { Parser } from 'json2csv';
import Sale from '../models/Sales.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find();

    // Flatten the entries so each row is one product entry
    const flattened = [];

    sales.forEach(sale => {
      sale.entries.forEach(entry => {
        flattened.push({
          date: sale.date.toISOString().split('T')[0],
          product: entry.product,
          barcode: entry.barcode,
          quantity: entry.quantity,
          price: entry.price,
          remarks: entry.remarks || '',
          paymentMethod: sale.paymentMethod,
          totalSaleAmount: sale.total
        });
      });
    });

    const fields = [
      'date',
      'product',
      'barcode',
      'quantity',
      'price',
      'remarks',
      'paymentMethod',
      'totalSaleAmount'
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(flattened);

    res.header('Content-Type', 'text/csv');
    res.attachment('sales_data.csv');
    return res.send(csv);
  } catch (err) {
    console.error("CSV Export Error:", err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

export default router;
