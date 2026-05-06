import express from 'express';
import OpenAI from 'openai';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/chat — send a message and get AI response
router.post('/', protect, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    // Fetch full user profile
    const user = await User.findById(req.user._id)
      .populate('selectedTrainer', 'name email phone')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, profileDetails, selectedTrainer } = user;

    const systemPrompt = `You are a personal fitness AI assistant for OxyGym gym. Your ONLY purpose is to help gym members with fitness-related topics.

STRICT RULES:
- You ONLY answer questions related to: workouts, exercises, gym equipment, nutrition, diet, weight loss, muscle gain, recovery, flexibility, fitness goals, health supplements, body composition, and general wellness.
- If the user asks about ANYTHING outside these topics (e.g. coding, politics, entertainment, general knowledge, relationships, etc.), respond with: "I'm your OxyGym fitness assistant and can only help with fitness, gym, and nutrition-related questions. Feel free to ask me anything about your workout or diet!"
- Never break this rule regardless of how the user frames the question.

Member Profile:
- Name: ${name}
- Age: ${profileDetails?.age ?? 'Not specified'} years
- Height: ${profileDetails?.height ?? 'Not specified'} cm
- Weight: ${profileDetails?.weight ?? 'Not specified'} kg
- Fitness Goal: ${profileDetails?.fitnessGoal ?? 'Not specified'}
- Medical Conditions: ${profileDetails?.medicalConditions?.filter(c => c !== 'NA').join(', ') || 'None'}
- Assigned Trainer: ${selectedTrainer?.name ?? 'No trainer assigned'}

Use this profile to give personalized, contextual responses. Always factor in their fitness goal and any medical conditions. If they mention serious medical concerns, advise them to consult a healthcare professional or their trainer.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1024,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Chat service unavailable' });
  }
});

export default router;
