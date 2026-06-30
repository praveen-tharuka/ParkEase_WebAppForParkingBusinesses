const express = require('express');
const prisma = require('../prisma');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/reservations
router.get('/', protect, async (req, res) => {
  try {
    const { status, customerId } = req.query;
    const filter = {};
    
    if (req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      filter.customerId = req.user.id;
    } else if (customerId) {
      filter.customerId = customerId;
    }

    if (status) {
      filter.status = status;
    }

    const reservations = await prisma.reservation.findMany({
      where: filter,
      include: {
        slot: {
          include: {
            location: true,
            supportedVehicleType: true,
          },
        },
        vehicle: {
          include: {
            vehicleType: true,
          },
        },
        payments: true,
        ticket: true,
      },
      orderBy: { startTime: 'desc' }
    });

    return res.status(200).json(reservations);
  } catch (error) {
    console.error('List Reservations Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/reservations/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await prisma.reservation.findFirst({
      where: {
        OR: [
          { id },
          { reservationCode: id }
        ]
      },
      include: {
        slot: {
          include: {
            location: true,
            supportedVehicleType: true,
          },
        },
        vehicle: {
          include: {
            vehicleType: true,
          },
        },
        payments: true,
        ticket: true,
      },
    });

    if (!reservation) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    if (reservation.customerId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    return res.status(200).json(reservation);
  } catch (error) {
    console.error('Get Reservation Details Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PATCH /api/reservations/:id
router.patch('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, specialRequests, notes } = req.body;

    const reservation = await prisma.reservation.findFirst({
      where: {
        OR: [
          { id },
          { reservationCode: id }
        ]
      }
    });

    if (!reservation) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    if (reservation.customerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const updateData = {};
    if (startTime !== undefined) updateData.startTime = new Date(startTime);
    if (endTime !== undefined) updateData.endTime = new Date(endTime);
    if (specialRequests !== undefined) updateData.specialRequests = specialRequests;
    if (notes !== undefined) updateData.notes = notes;

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservation.id },
      data: updateData,
      include: {
        slot: {
          include: {
            location: true,
            supportedVehicleType: true,
          },
        },
        vehicle: {
          include: {
            vehicleType: true,
          },
        },
        payments: true,
        ticket: true,
      }
    });

    return res.status(200).json(updatedReservation);
  } catch (error) {
    console.error('Update Reservation Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PATCH /api/reservations/:id/cancel
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const reservation = await prisma.reservation.findFirst({
      where: {
        OR: [
          { id },
          { reservationCode: id }
        ]
      }
    });

    if (!reservation) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    if (reservation.customerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason || 'Cancelled by user',
        cancelledAt: new Date()
      },
      include: {
        slot: {
          include: {
            location: true,
            supportedVehicleType: true,
          },
        },
        vehicle: {
          include: {
            vehicleType: true,
          },
        },
        payments: true,
        ticket: true,
      }
    });

    return res.status(200).json(updatedReservation);
  } catch (error) {
    console.error('Cancel Reservation Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
