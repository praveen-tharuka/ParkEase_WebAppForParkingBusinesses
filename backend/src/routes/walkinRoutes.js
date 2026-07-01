const express = require('express');
const prisma = require('../prisma');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper to check staff permissions
const staffOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'OFFICER')) {
    next();
  } else {
    return res.status(403).json({ success: false, error: 'Access denied: Staff only' });
  }
};

// @desc    Register a new walk-in vehicle
// @route   POST /api/walkins
// @access  Private (Staff only)
router.post('/', protect, staffOnly, async (req, res) => {
  try {
    const { licensePlate, vehicleType, phoneNumber, slotNumber } = req.body;

    if (!licensePlate || !vehicleType || !phoneNumber || !slotNumber) {
      return res.status(400).json({ success: false, error: 'All fields (licensePlate, vehicleType, phoneNumber, slotNumber) are required' });
    }

    // 1. Verify Slot Status
    const slot = await prisma.parkingSlot.findUnique({
      where: { slotNumber: slotNumber.trim() },
      include: { location: true }
    });

    if (!slot) {
      return res.status(404).json({ success: false, error: `Parking slot ${slotNumber} not found` });
    }

    if (slot.status !== 'AVAILABLE') {
      return res.status(400).json({ success: false, error: `Parking slot ${slotNumber} is not available (Status: ${slot.status})` });
    }

    // 2. Find the Vehicle Type ID
    const typeRecord = await prisma.vehicleType.findFirst({
      where: {
        name: {
          equals: vehicleType.trim(),
          mode: 'insensitive'
        }
      }
    });

    if (!typeRecord) {
      return res.status(404).json({ success: false, error: `Vehicle type ${vehicleType} is not supported` });
    }

    // 3. Find or Create the Vehicle
    let vehicle = await prisma.vehicle.findUnique({
      where: { plateNumber: licensePlate.toUpperCase().trim() }
    });

    if (!vehicle) {
      // Create new vehicle for this walk-in
      vehicle = await prisma.vehicle.create({
        data: {
          plateNumber: licensePlate.toUpperCase().trim(),
          make: 'Walk-In',
          model: 'Generic',
          status: 'ACTIVE',
          isVerified: true,
          ownerName: 'Walk-In Customer',
          contact: phoneNumber.trim(),
          vehicleTypeId: typeRecord.id,
          registeredByOfficerId: req.user.id
        }
      });
    } else {
      // Update contact details if it exists
      vehicle = await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: {
          contact: phoneNumber.trim()
        }
      });
    }

    // 4. Create ParkingTicket and Update Slot Status in a Transaction
    const ticketNumber = 'TKT-' + String(Date.now());
    const ticketBarcode = 'BC-' + String(Date.now());

    const result = await prisma.$transaction(async (tx) => {
      const ticket = await tx.parkingTicket.create({
        data: {
          ticketNumber,
          ticketBarcode,
          slotId: slot.id,
          vehicleId: vehicle.id,
          officerId: req.user.id,
          allocationType: 'WALK_IN',
          checkInTime: new Date(),
          parkingFee: 0.00,
          totalFee: 0.00,
          status: 'ACTIVE',
          isPrinted: false
        },
        include: {
          slot: {
            include: {
              location: true
            }
          },
          vehicle: true
        }
      });

      await tx.parkingSlot.update({
        where: { id: slot.id },
        data: { status: 'OCCUPIED' }
      });

      return ticket;
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Create Walk-In Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error during walk-in registration' });
  }
});

// @desc    Get all active or completed walk-in registrations
// @route   GET /api/walkins
// @access  Private (Staff only)
router.get('/', protect, staffOnly, async (req, res) => {
  try {
    const { status } = req.query; // 'active', 'completed', 'all'
    
    const filter = {
      allocationType: 'WALK_IN'
    };

    if (status && status !== 'all') {
      filter.status = status.toUpperCase() === 'ACTIVE' ? 'ACTIVE' : 'COMPLETED';
    }

    const tickets = await prisma.parkingTicket.findMany({
      where: filter,
      include: {
        slot: {
          include: {
            location: true
          }
        },
        vehicle: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map DB models to the fields expected by the frontend
    const mapped = tickets.map(ticket => ({
      id: ticket.id,
      licensePlate: ticket.vehicle.plateNumber,
      vehicleType: ticket.vehicle.make === 'Walk-In' ? 'Car' : ticket.vehicle.make,
      phoneNumber: ticket.vehicle.contact || 'N/A',
      assignedSlot: ticket.slot.slotNumber,
      location: ticket.slot.location.name,
      checkInTime: ticket.checkInTime ? new Date(ticket.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      checkoutTime: ticket.checkOutTime ? new Date(ticket.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
      status: ticket.status.toLowerCase(), // 'active' or 'completed'
      registrationDate: ticket.createdAt.toISOString().split('T')[0]
    }));

    // Retrieve correct vehicle type name from DB for each ticket to be safe
    for (let i = 0; i < mapped.length; i++) {
      const typeRecord = await prisma.vehicleType.findUnique({
        where: { id: tickets[i].vehicle.vehicleTypeId }
      });
      if (typeRecord) {
        mapped[i].vehicleType = typeRecord.name;
      }
    }

    return res.status(200).json({ success: true, data: mapped });
  } catch (error) {
    console.error('Get Walk-Ins Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error while fetching walk-ins' });
  }
});

// @desc    Checkout a walk-in vehicle
// @route   PATCH /api/walkins/:id/checkout
// @access  Private (Staff only)
router.patch('/:id/checkout', protect, staffOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.parkingTicket.findUnique({
      where: { id },
      include: { slot: true }
    });

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Parking ticket not found' });
    }

    if (ticket.status !== 'ACTIVE') {
      return res.status(400).json({ success: false, error: 'Ticket is already checked out or completed' });
    }

    const checkOutTime = new Date();
    
    // Calculate fee dynamically based on duration if slot type has fee structure
    let totalHours = 1;
    if (ticket.checkInTime) {
      const diffMs = checkOutTime.getTime() - new Date(ticket.checkInTime).getTime();
      totalHours = Math.ceil(diffMs / (1000 * 60 * 60));
    }
    
    // Default hourly rate is $5.00 if we cannot find fee structure
    let hourlyRate = 5.00;
    const feeStructure = await prisma.feeStructure.findFirst({
      where: {
        vehicleTypeId: ticket.vehicle ? ticket.vehicle.vehicleTypeId : undefined,
        isActive: true
      }
    });
    if (feeStructure) {
      hourlyRate = Number(feeStructure.hourlyRate);
    }
    const calculatedFee = hourlyRate * totalHours;

    const result = await prisma.$transaction(async (tx) => {
      const updatedTicket = await tx.parkingTicket.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          checkOutTime,
          parkingFee: calculatedFee,
          totalFee: calculatedFee
        }
      });

      await tx.parkingSlot.update({
        where: { id: ticket.slotId },
        data: { status: 'AVAILABLE' }
      });

      return updatedTicket;
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Checkout Walk-In Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error during checkout' });
  }
});

// @desc    Remove/Cancel a walk-in registration
// @route   DELETE /api/walkins/:id
// @access  Private (Staff only)
router.delete('/:id', protect, staffOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.parkingTicket.findUnique({
      where: { id }
    });

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Parking ticket not found' });
    }

    await prisma.$transaction(async (tx) => {
      // Free the slot
      await tx.parkingSlot.update({
        where: { id: ticket.slotId },
        data: { status: 'AVAILABLE' }
      });

      // Delete the ticket
      await tx.parkingTicket.delete({
        where: { id }
      });
    });

    return res.status(200).json({ success: true, message: 'Walk-in registration removed successfully' });
  } catch (error) {
    console.error('Delete Walk-In Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error during removal' });
  }
});

module.exports = router;
