/**
 * Reservations Controller
 * Handles HTTP request/response for reservation endpoints.
 */
const reservationsService = require('./reservations.service');

async function createReservation(req, res) {
  try {
    const { customerId, slotId, vehicleId, startTime, endTime, specialRequests, notes } = req.body;
    const reservation = await reservationsService.createReservation({
      customerId,
      slotId,
      vehicleId,
      startTime,
      endTime,
      specialRequests,
      notes,
    });
    res.status(201).json({ success: true, data: reservation });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
}

async function getReservationById(req, res) {
  try {
    const reservation = await reservationsService.getReservationById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    res.json({ success: true, data: reservation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function listReservations(req, res) {
  try {
    const { customerId, status } = req.query;
    const reservations = await reservationsService.listReservations({ customerId, status });
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function updateReservation(req, res) {
  try {
    const { startTime, endTime, specialRequests, notes } = req.body;
    const reservation = await reservationsService.updateReservation(req.params.id, {
      startTime,
      endTime,
      specialRequests,
      notes,
    });
    res.json({ success: true, data: reservation });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
}

async function cancelReservation(req, res) {
  try {
    const { reason } = req.body;
    const reservation = await reservationsService.cancelReservation(req.params.id, reason);
    res.json({ success: true, data: reservation });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
}

async function checkIn(req, res) {
  try {
    const { officerId } = req.body;
    const ticket = await reservationsService.checkInReservation(req.params.id, officerId);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
}

async function checkout(req, res) {
  try {
    const ticket = await reservationsService.checkoutReservation(req.params.id);
    res.json({ success: true, data: ticket });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
}

module.exports = {
  createReservation,
  getReservationById,
  listReservations,
  updateReservation,
  cancelReservation,
  checkIn,
  checkout,
};