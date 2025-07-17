import express from 'express';
import auth from '../middleware/auth.js';
import Log from '../models/Log.js';

const router = express.Router();

// GET /api/logs - fetch latest logs for the logged-in user's company
router.get('/', auth, async (req, res) => {
  try {
    const company = req.user.company;

    const logs = await Log.find({ company })
      .sort({ createdAt: -1 })  // Most recent first
      .limit(15)                
      .select('-__v');          // Exclude __v field

    res.json(logs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;
