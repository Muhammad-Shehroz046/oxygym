import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all trainers
router.get('/trainers', protect, async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' })
      .select('-password -__v');
    res.json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Select trainer
router.put('/select-trainer', protect, async (req, res) => {
  try {
    const { trainerId } = req.body;
    
    // Update user with selected trainer
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { selectedTrainer: trainerId },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error selecting trainer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('selectedTrainer', 'name email phone category')
      .select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT/UPDATE USER PROFILE DETAILS
router.put('/profile', protect, async (req, res) => {
  try {
    const { age, height, weight, fitnessGoal, medicalConditions } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update profile details
    user.profileDetails = {
      age,
      height,
      weight,
      fitnessGoal,
      medicalConditions,
    };
    user.isProfileComplete = true;

    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .populate('selectedTrainer', 'name email phone category')
      .select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

export default router;