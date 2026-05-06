// models/DietPlan.js
import mongoose from "mongoose";

const dietDaySchema = new mongoose.Schema({
  day: { type: String },
  breakfast: { type: String },
  lunch: { type: String },
  dinner: { type: String },
  snacks: { type: String },
});

const dietPlanSchema = new mongoose.Schema({
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  dietPlan: { type: [dietDaySchema],  }
});

export default mongoose.model("DietPlan", dietPlanSchema);
