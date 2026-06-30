/**
 * Slots Routes
 *  GET /api/slots                 -> list all slots (filters: status, slotType, locationId)
 *  GET /api/slots/availability    -> find available slots for a time range
 *  GET /api/slots/:id             -> get a single slot
 */
const express = require('express');
const router = express.Router();
const slotsController = require('./slots.controller');

router.get('/availability', slotsController.getAvailability);
router.get('/:id', slotsController.getSlotById);
router.get('/', slotsController.getSlots);

module.exports = router;