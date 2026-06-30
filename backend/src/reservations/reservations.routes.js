const express = require('express');
const router = express.Router();
const reservationsController = require('./reservations.controller');

router.post('/', reservationsController.createReservation);
router.get('/', reservationsController.listReservations);
router.get('/:id', reservationsController.getReservationById);
router.patch('/:id', reservationsController.updateReservation);
router.delete('/:id', reservationsController.cancelReservation);
router.post('/:id/checkin', reservationsController.checkIn);
router.post('/:id/checkout', reservationsController.checkout);

module.exports = router;