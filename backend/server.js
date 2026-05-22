import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js'
import workoutPlanRoutes from './routes/workoutPlanRoutes.js';
import dietRoutes from './routes/dietPlanModal.js';
import chatRoutes from './routes/chatRoutes.js';
import membershipRecordRoutes from './routes/membershipRecordRoutes.js';
import dailyLogRoutes from './routes/dailyLogRoutes.js';



// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const httpServer = createServer(app);
const ALLOWED_ORIGIN = process.env.FRONTEND_URL || '*';

const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors({ origin: ALLOWED_ORIGIN }));

// Special middleware for Stripe webhooks (must be before express.json())
app.use('/api/payments/webhook', express.raw({type: 'application/json'}));

// Regular JSON parsing middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/plan', workoutPlanRoutes);
app.use("/api/diet-plans", dietRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/membership-records', membershipRecordRoutes);
app.use('/api/daily-logs', dailyLogRoutes);


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  
  // Real-time data update events
  socket.on('dataUpdate', (data) => {
    io.emit('dataRefresh', { type: data.type });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Server startup
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});