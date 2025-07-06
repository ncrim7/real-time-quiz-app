import express from 'express';
import LoginLog from '../models/LoginLog.js';
import User from '../models/User.js';

const router = express.Router();

// Son 100 giriş logunu getir (admin panel için örnek)
router.get('/', async (req, res) => {
  try {
    const logs = await LoginLog.find({})
      .sort({ time: -1 })
      .limit(100)
      .populate('user', 'username email');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Loglar alınamadı.' });
  }
});

export default router;
