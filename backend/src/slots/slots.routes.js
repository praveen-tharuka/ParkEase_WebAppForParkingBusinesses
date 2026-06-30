const express = require('express');
const router = express.Router();
const slotsController = require('./slots.controller');

router.get('/availability', slotsController.getAvailability);
router.get('/:id', slotsController.getSlotById);
router.get('/', slotsController.getSlots);

module.exports = router;