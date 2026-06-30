/**
 * Slots Controller
 * Handles HTTP request/response for slot endpoints.
 */
const slotsService = require('./slots.service');

async function getSlots(req, res) {
  try {
    const { status, slotType, locationId } = req.query;
    const slots = await slotsService.listSlots({ status, slotType, locationId });
    res.json({ success: true, count: slots.length, data: slots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getSlotById(req, res) {
  try {
    const slot = await slotsService.getSlotById(req.params.id);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }
    res.json({ success: true, data: slot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getAvailability(req, res) {
  try {
    const { startTime, endTime, slotType, locationId, vehicleTypeId } = req.query;
    const slots = await slotsService.findAvailableSlots({
      startTime,
      endTime,
      slotType,
      locationId,
      vehicleTypeId,
    });
    res.json({ success: true, count: slots.length, data: slots });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getSlots,
  getSlotById,
  getAvailability,
};