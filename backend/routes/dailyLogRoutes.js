import express from 'express';
import DailyLog from '../models/DailyLog.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Upsert today's log (user saves/updates their own log)
router.post('/', protect, async (req, res) => {
  try {
    const { date, dayOfWeek, workout, diet, mood } = req.body;

    const log = await DailyLog.findOneAndUpdate(
      { userId: req.user._id, date },
      { userId: req.user._id, date, dayOfWeek, workout, diet, mood },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(log);
  } catch (error) {
    console.error('Error saving daily log:', error);
    res.status(500).json({ message: 'Server error saving log' });
  }
});

// Get logged-in user's own logs
router.get('/my', protect, async (req, res) => {
  try {
    const logs = await DailyLog.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Trainer / admin: get any user's logs
router.get('/user/:userId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'trainer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const logs = await DailyLog.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Trainer / admin: stats for a user
router.get('/user/:userId/stats', protect, async (req, res) => {
  try {
    if (req.user.role !== 'trainer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const logs = await DailyLog.find({ userId: req.params.userId, 'workout.status': { $ne: 'rest' } })
      .sort({ date: 1 });

    const total = logs.length;
    const completed  = logs.filter(l => l.workout.status === 'completed').length;
    const partial    = logs.filter(l => l.workout.status === 'partial').length;
    const missed     = logs.filter(l => l.workout.status === 'missed').length;

    // Current streak (consecutive completed/partial days ending today or yesterday)
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const log = logs.find(l => l.date === key);
      if (log && (log.workout.status === 'completed' || log.workout.status === 'partial')) {
        streak++;
      } else {
        break;
      }
    }

    // This week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const weekLogs = logs.filter(l => new Date(l.date) >= startOfWeek);
    const weekRate = weekLogs.length
      ? Math.round((weekLogs.filter(l => l.workout.status === 'completed').length / weekLogs.length) * 100)
      : 0;

    // Monthly breakdown for chart (last 8 weeks)
    const weeklyData = [];
    for (let w = 7; w >= 0; w--) {
      const wStart = new Date(today);
      wStart.setDate(today.getDate() - today.getDay() - w * 7);
      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 6);
      const wLogs = logs.filter(l => {
        const d = new Date(l.date);
        return d >= wStart && d <= wEnd;
      });
      const label = `W${8 - w}`;
      weeklyData.push({
        label,
        completed: wLogs.filter(l => l.workout.status === 'completed').length,
        partial:   wLogs.filter(l => l.workout.status === 'partial').length,
        missed:    wLogs.filter(l => l.workout.status === 'missed').length
      });
    }

    res.json({ total, completed, partial, missed, streak, weekRate, weeklyData });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
