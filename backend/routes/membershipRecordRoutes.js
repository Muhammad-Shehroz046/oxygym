import express from 'express';
import MembershipRecord from '../models/MembershipRecord.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Save a membership record after successful payment (called by logged-in user)
router.post('/', protect, async (req, res) => {
  try {
    const { planName, billingPeriod, amount, stripePaymentIntentId, userName, userEmail, userPhone } = req.body;

    const record = new MembershipRecord({
      userId: req.user._id,
      userName: userName || req.user.name,
      userEmail: userEmail || req.user.email,
      userPhone: userPhone || '',
      planName,
      billingPeriod,
      amount,
      stripePaymentIntentId: stripePaymentIntentId || '',
      status: 'succeeded'
    });

    await record.save();
    res.status(201).json(record);
  } catch (error) {
    console.error('Error saving membership record:', error);
    res.status(500).json({ message: 'Server error saving membership record' });
  }
});

// Get all records — admin only
router.get('/', protect, admin, async (req, res) => {
  try {
    const records = await MembershipRecord.find({})
      .populate('userId', 'name email phone role')
      .sort({ paidAt: -1 });
    res.json(records);
  } catch (error) {
    console.error('Error fetching membership records:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Monthly earnings stats for chart — admin only
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const records = await MembershipRecord.find({ status: 'succeeded' });

    // Group by year-month
    const monthlyMap = {};
    records.forEach(r => {
      const date = new Date(r.paidAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: key, revenue: 0, count: 0 };
      }
      monthlyMap[key].revenue += r.amount;
      monthlyMap[key].count += 1;
    });

    // Sort by month ascending, keep last 12 months
    const monthly = Object.values(monthlyMap)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12)
      .map(m => ({
        ...m,
        label: new Date(m.month + '-01').toLocaleString('default', { month: 'short', year: '2-digit' })
      }));

    // Plan breakdown
    const planMap = {};
    records.forEach(r => {
      planMap[r.planName] = (planMap[r.planName] || 0) + r.amount;
    });
    const planBreakdown = Object.entries(planMap).map(([name, revenue]) => ({ name, revenue }));

    // Summary totals
    const totalRevenue = records.reduce((sum, r) => sum + r.amount, 0);
    const now = new Date();
    const thisMonthRevenue = records
      .filter(r => {
        const d = new Date(r.paidAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, r) => sum + r.amount, 0);

    res.json({ monthly, planBreakdown, totalRevenue, thisMonthRevenue, totalRecords: records.length });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
