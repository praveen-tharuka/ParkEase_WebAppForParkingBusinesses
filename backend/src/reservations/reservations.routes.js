/**
 * Reservations Routes
 *  POST   /api/reservations              -> create a reservation
 *  GET    /api/reservations              -> list reservations (filters: customerId, status)
 *  GET    /api/reservations/:id          -> get a single reservation
 *  PATCH  /api/reservations/:id          -> update reservation (time / notes)
 *  DELETE /api/reservations/:id          -> cancel reservation
 *  POST   /api/reservations/:id/checkin  -> check in (generates ticket)
 *  POST   /api/reservations/:id/checkout -> check out (closes ticket)
 */
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