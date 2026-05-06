// routes/dietRoutes.js
import express from "express";
import DietPlan from "../models/dietplanmodal.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// routes/dietRoutes.js
router.post("/", async (req, res) => {
  try {
    const { memberId, category, dietPlan } = req.body;

    // Debug logs
    console.log("Saving diet plan for:", memberId);
    console.log("Category:", category);
    console.log("DietPlan:", dietPlan);

    // Check and delete old plan
    const existing = await DietPlan.findOne({ memberId, category });
    if (existing) {
      await DietPlan.deleteOne({ _id: existing._id });
    }

    // Save new plan
    const newPlan = new DietPlan({
      memberId,
      category,
      dietPlan
    });

    await newPlan.save();

    res.status(201).json({ message: "Diet plan saved" });
  } catch (err) {
    console.error("❌ Diet Plan Save Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/user/:id", async (req, res) => {
  try {
    const plan = await DietPlan.findOne({ memberId: req.params.id });
    if (!plan) return res.status(404).json({ error: "No plan found" });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
