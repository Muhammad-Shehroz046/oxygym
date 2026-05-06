// POST /api/membership/validate-email
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// routes/membershipRoutes.js
router.post('/validate-email', protect, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Unauthorized. Email not registered.' });
    }

    return res.status(200).json({ message: 'Email is valid.' });
  } catch (err) {
    console.error('Email validation error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
