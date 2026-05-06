import express from 'express';
import User from '../models/User.js';
import { protect, trainer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get trainer profile
router.get('/profile', protect, trainer, async (req, res) => {
  try {
    const profile = await User.findById(req.user._id)
      .select('-password -__v');
    
    if (!profile) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching trainer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assigned users
router.get('/assigned-users', protect, trainer, async (req, res) => {
  try {
    const assignedUsers = await User.find({ 
      selectedTrainer: req.user._id,
      role: 'user'
    }).select('-password -__v');
    
    res.json(assignedUsers);
  } catch (error) {
    console.error('Error fetching assigned users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;