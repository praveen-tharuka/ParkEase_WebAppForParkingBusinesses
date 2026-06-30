/**
 * ParkEase Backend — Entrypoint
 * Express app wiring up the API routes.
 */
const express = require('express');
const slotsRoutes = require('./slots/slots.routes');
const reservationsRoutes = require('./reservations/reservations.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check / root
app.get('/', (_req, res) => {
  res.json({
    service: 'ParkEase Backend',
    status: 'running',
    database: 'PostgreSQL (Prisma)',
  });
});

// Feature routes
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

app.listen(PORT, () => {
  console.log(`🚀 ParkEase backend running on port ${PORT}`);
  console.log(`   GET  /api/slots`);
  console.log(`   GET  /api/slots/availability?startTime=...&endTime=...`);
  console.log(`   POST /api/reservations`);
});