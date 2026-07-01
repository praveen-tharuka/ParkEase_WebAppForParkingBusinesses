const express = require('express');
const prisma = require('../prisma');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/reservations/:reservationId/ticket
router.get('/:reservationId/ticket', protect, async (req, res) => {
  try {
    const { reservationId } = req.params;

    // Find the reservation first to verify access and get slot/vehicle info
    const reservation = await prisma.reservation.findFirst({
      where: {
        OR: [
          { id: reservationId },
          { reservationCode: reservationId }
        ]
      },
      include: {
        slot: {
          include: {
            location: true,
            supportedVehicleType: true,
          }
        },
        vehicle: {
          include: {
            vehicleType: true,
          }
        }
      }
    });

    if (!reservation) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    if (reservation.customerId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Find or create the ticket
    let ticket = await prisma.parkingTicket.findUnique({
      where: { reservationId: reservation.id },
      include: {
        reservation: true,
        slot: {
          include: {
            location: true,
          }
        },
        vehicle: {
          include: {
            vehicleType: true,
          }
        }
      }
    });

    if (!ticket) {
      const ticketNumber = 'TKT-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
      const ticketBarcode = 'BC-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
      const entryCode = Math.floor(100000 + Math.random() * 900000).toString();

      ticket = await prisma.parkingTicket.create({
        data: {
          ticketNumber,
          ticketBarcode,
          entryCode,
          slotId: reservation.slotId,
          vehicleId: reservation.vehicleId,
          reservationId: reservation.id,
          customerId: reservation.customerId,
          allocationType: 'RESERVED',
          status: 'ACTIVE',
          parkingFee: reservation.totalFee,
          totalFee: reservation.totalFee,
          isPrinted: false,
        },
        include: {
          reservation: true,
          slot: {
            include: {
              location: true,
            }
          },
          vehicle: {
            include: {
              vehicleType: true,
            }
          }
        }
      });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error('Get/Create Parking Ticket Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/reservations/:reservationId/ticket (Generate Ticket)
router.post('/:reservationId/ticket', protect, async (req, res) => {
  try {
    const { reservationId } = req.params;

    const reservation = await prisma.reservation.findFirst({
      where: {
        OR: [
          { id: reservationId },
          { reservationCode: reservationId }
        ]
      }
    });

    if (!reservation) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    if (reservation.customerId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    let ticket = await prisma.parkingTicket.findUnique({
      where: { reservationId: reservation.id },
      include: {
        reservation: true,
        slot: {
          include: {
            location: true,
          }
        },
        vehicle: {
          include: {
            vehicleType: true,
          }
        }
      }
    });

    if (!ticket) {
      const ticketNumber = 'TKT-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
      const ticketBarcode = 'BC-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
      const entryCode = Math.floor(100000 + Math.random() * 900000).toString();

      ticket = await prisma.parkingTicket.create({
        data: {
          ticketNumber,
          ticketBarcode,
          entryCode,
          slotId: reservation.slotId,
          vehicleId: reservation.vehicleId,
          reservationId: reservation.id,
          customerId: reservation.customerId,
          allocationType: 'RESERVED',
          status: 'ACTIVE',
          parkingFee: reservation.totalFee,
          totalFee: reservation.totalFee,
          isPrinted: false,
        },
        include: {
          reservation: true,
          slot: {
            include: {
              location: true,
            }
          },
          vehicle: {
            include: {
              vehicleType: true,
            }
          }
        }
      });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error('Generate Parking Ticket Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
