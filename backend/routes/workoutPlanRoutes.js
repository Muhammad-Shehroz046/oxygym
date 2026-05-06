import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// === Workout Plan Schema ===
const exerciseSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: Number,
});

const dayPlanSchema = new mongoose.Schema({
  type: String,
  exercises: [exerciseSchema],
});

const workoutPlanSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true },
  // category: { type: String, required: true },
  plan: {
    Monday: dayPlanSchema,
    Tuesday: dayPlanSchema,
    Wednesday: dayPlanSchema,
    Thursday: dayPlanSchema,
    Friday: dayPlanSchema,
    Saturday: dayPlanSchema,
    Sunday: dayPlanSchema,
  },
});

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);

// === Save Plan (Trainer Only) ===



// ✅ Save or update plan without category
router.post('/save', async (req, res) => {
  try {
    const { userEmail, plan } = req.body;

    if (!userEmail || !plan) {
      return res.status(400).json({ message: 'User email and plan are required' });
    }

    const existing = await WorkoutPlan.findOne({ userEmail });

    if (existing) {
      existing.plan = plan;
      await existing.save();
      return res.json({ message: 'Workout plan updated successfully' });
    }

    await WorkoutPlan.create({ userEmail, plan });
    res.status(201).json({ message: 'Workout plan saved successfully' });
  } catch (err) {
    console.error('Error saving workout plan:', err);
    res.status(500).json({ message: 'Failed to save workout plan' });
  }
});

// ✅ Get plan by user email
router.get('/:email', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ userEmail: req.params.email });

    if (!plan) {
      return res.status(404).json({ message: 'No plan found' });
    }

    res.json(plan);
  } catch (err) {
    console.error('Error getting workout plan:', err);
    res.status(500).json({ message: 'Failed to get workout plan' });
  }
});

export default router;

