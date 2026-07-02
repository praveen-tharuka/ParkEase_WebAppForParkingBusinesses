const express = require('express');
const prisma = require('../prisma');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/reports/overview
router.get('/overview', protect, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin or Officer access only' });
    }

    const totalSlots = await prisma.parkingSlot.count();
    const availableSlots = await prisma.parkingSlot.count({
      where: { status: 'AVAILABLE' }
    });

    const activeBookings = await prisma.reservation.count({
      where: {
        status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] }
      }
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const paymentsToday = await prisma.payment.findMany({
      where: {
        paymentStatus: 'PAID',
        paymentDate: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    });
    const todayRevenue = paymentsToday.reduce((sum, p) => sum + Number(p.totalAmount), 0);

    return res.status(200).json({
      success: true,
      totalSlots,
      availableSlots,
      activeBookings,
      todayRevenue
    });
  } catch (error) {
    console.error('Get Overview Report Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
