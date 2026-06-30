const express = require('express');
const prisma = require('../prisma');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden: You cannot access other users profiles' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Get User Profile Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.patch('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, company, address, city, state, zipCode, profilePictureUrl } = req.body;

    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden: You cannot edit other users profiles' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        fullName,
        phone,
        company,
        address,
        city,
        state,
        zipCode,
        profilePictureUrl,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Update User Profile Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/:id/reservations', protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: 'Forbidden: You cannot access other users bookings' });
    }

    const reservations = await prisma.reservation.findMany({
      where: { customerId: id },
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
      orderBy: { startTime: 'desc' },
    });

    return res.status(200).json(reservations);
  } catch (error) {
    console.error('Get User Reservations Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
