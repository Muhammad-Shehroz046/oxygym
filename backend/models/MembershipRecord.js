import mongoose from 'mongoose';

const membershipRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, default: '' },
  planName: { type: String, required: true },       // Basic / Premium / Elite
  billingPeriod: { type: String, required: true },  // monthly / annual
  amount: { type: Number, required: true },          // in dollars
  stripePaymentIntentId: { type: String, default: '' },
  status: {
    type: String,
    enum: ['succeeded', 'failed', 'pending'],
    default: 'succeeded'
  },
  paidAt: { type: Date, default: Date.now }
}, { timestamps: true });

const MembershipRecord = mongoose.model('MembershipRecord', membershipRecordSchema);
export default MembershipRecord;
