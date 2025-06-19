import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import stockRoutes from './routes/inventory.js'
import salesRoutes from './routes/sales.js';
import exportRoutes from './routes/export.js'
import alertRoutes from './routes/alerts.js'
import logRoutes from './routes/logs.js'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory',stockRoutes)
app.use('/api/sales',salesRoutes)
app.use('/api/export',exportRoutes)
app.use('/api/alerts',alertRoutes)
app.use('/api/logs',logRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
