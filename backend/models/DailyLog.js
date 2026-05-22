import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },         // YYYY-MM-DD
  dayOfWeek: { type: String, required: true },    // Monday … Sunday

  workout: {
    status: { type: String, enum: ['completed', 'partial', 'missed', 'rest'], default: 'rest' },
    exercises: [{ name: String, sets: String, reps: String, done: Boolean }],
    notes: { type: String, default: '' }
  },

  diet: {
    status: { type: String, enum: ['completed', 'partial', 'missed', 'rest'], default: 'rest' },
    meals: {
      breakfast: { type: Boolean, default: false },
      lunch:     { type: Boolean, default: false },
      dinner:    { type: Boolean, default: false },
      snacks:    { type: Boolean, default: false }
    },
    notes: { type: String, default: '' }
  },

  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'tired', 'sick', ''],
    default: ''
  }
}, { timestamps: true });

// One log per user per day
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyLog = mongoose.model('DailyLog', dailyLogSchema);
export default DailyLog;
