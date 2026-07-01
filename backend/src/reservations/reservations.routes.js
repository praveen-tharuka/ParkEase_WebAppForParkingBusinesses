const express = require('express');
const router = express.Router();
const reservationsController = require('./reservations.controller');
const { protect } = require('../middleware/authMiddleware');

// Apply JWT authentication protection to all reservation endpoints
router.use(protect);

router.post('/', reservationsController.createReservation);
router.get('/', reservationsController.listReservations);
router.get('/:id', reservationsController.getReservationById);
router.patch('/:id', reservationsController.updateReservation);
router.patch('/:id/cancel', reservationsController.cancelReservation);
router.delete('/:id', reservationsController.cancelReservation);
router.post('/:id/checkin', reservationsController.checkIn);
router.post('/:id/checkout', reservationsController.checkout);

module.exports = router;