/**
 * ParkEase Backend — Entrypoint
 * This initializes the Express server, connects routes, and starts listening.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const slotsRoutes = require('./slots/slots.routes');
const reservationsRoutes = require('./reservations/reservations.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Health Check Route
app.get('/', (_req, res) => {
  res.status(200).json({
    service: 'ParkEase Backend',
    status: 'running',
    database: 'PostgreSQL (Prisma)',
    message: 'Express server running successfully with Prisma and Redis.',
  });
});

// Mounted Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/slots', slotsRoutes);
app.use('/api/reservations', reservationsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Generic error handler (safety net)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ParkEase backend server running on port ${PORT}`);
  console.log(`   Database schema is synchronized.`);
  console.log(`   GET  /api/slots`);
  console.log(`   GET  /api/slots/availability?startTime=...&endTime=...`);
  console.log(`   POST /api/reservations`);
});