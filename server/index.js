import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import movieRoutes from './routes/movies.js';
import theaterRoutes from './routes/theaters.js';
import showtimeRoutes from './routes/showtimes.js';
import bookingRoutes from './routes/bookings.js';
import { initRedis } from './lib/redis.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  tlsInsecure: true,
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    initRedis();
    app.listen(PORT, () => {
      console.log(`🚀 CineBook server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
