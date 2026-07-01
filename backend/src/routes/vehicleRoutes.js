const express = require('express');
const prisma = require('../prisma');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/vehicles
router.get('/', protect, async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { customerId: req.user.id },
      include: {
        vehicleType: true
      }
    });
    return res.status(200).json(vehicles);
  } catch (error) {
    console.error('Get User Vehicles Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/vehicles
router.post('/', protect, async (req, res) => {
  try {
    const { make, model, year, color, type } = req.body;
    const plateNumber = req.body.plateNumber || req.body.licensePlate || req.body.plate;

    if (!plateNumber || !make || !model || !type) {
      return res.status(400).json({ success: false, error: 'License plate, make, model, and vehicle type are required' });
    }

    // Check if duplicate plate number
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { plateNumber: plateNumber.toUpperCase().trim() }
    });

    if (existingVehicle) {
      return res.status(400).json({ success: false, error: 'A vehicle with this license plate is already registered' });
    }

    // Find the vehicle type
    const vehicleType = await prisma.vehicleType.findFirst({
      where: {
        name: {
          equals: type.trim(),
          mode: 'insensitive'
        }
      }
    });

    if (!vehicleType) {
      return res.status(400).json({ success: false, error: `Unsupported vehicle type: ${type}` });
    }

    const parsedYear = year ? parseInt(year, 10) : null;

    const newVehicle = await prisma.vehicle.create({
      data: {
        plateNumber: plateNumber.toUpperCase().trim(),
        make,
        model,
        year: parsedYear,
        color,
        customerId: req.user.id,
        vehicleTypeId: vehicleType.id,
        status: 'ACTIVE'
      },
      include: {
        vehicleType: true
      }
    });

    return res.status(201).json(newVehicle);
  } catch (error) {
    console.error('Create Vehicle Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PATCH /api/vehicles/:id
router.patch('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { make, model, year, color, type } = req.body;
    const plateNumber = req.body.plateNumber || req.body.licensePlate || req.body.plate;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    if (vehicle.customerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const updateData = {};
    if (make !== undefined) updateData.make = make;
    if (model !== undefined) updateData.model = model;
    if (year !== undefined) updateData.year = year ? parseInt(year, 10) : null;
    if (color !== undefined) updateData.color = color;
    
    if (plateNumber !== undefined) {
      const formattedPlate = plateNumber.toUpperCase().trim();
      if (formattedPlate !== vehicle.plateNumber) {
        // check if duplicate
        const duplicate = await prisma.vehicle.findUnique({
          where: { plateNumber: formattedPlate }
        });
        if (duplicate) {
          return res.status(400).json({ success: false, error: 'A vehicle with this license plate is already registered' });
        }
        updateData.plateNumber = formattedPlate;
      }
    }

    if (type !== undefined) {
      const vehicleType = await prisma.vehicleType.findFirst({
        where: {
          name: {
            equals: type.trim(),
            mode: 'insensitive'
          }
        }
      });
      if (!vehicleType) {
        return res.status(400).json({ success: false, error: `Unsupported vehicle type: ${type}` });
      }
      updateData.vehicleTypeId = vehicleType.id;
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: updateData,
      include: {
        vehicleType: true
      }
    });

    return res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error('Update Vehicle Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/vehicles/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    if (vehicle.customerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    await prisma.vehicle.delete({
      where: { id }
    });

    return res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete Vehicle Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
