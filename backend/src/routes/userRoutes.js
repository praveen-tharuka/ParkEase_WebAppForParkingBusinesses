const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const redisClient = require('../redis');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'parkease_secret_key_12345';

// GET /api/users
router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin or Officer access only' });
    }

    const { role, accountStatus } = req.query;
    const where = {};
    if (role) where.role = role;
    if (accountStatus) where.accountStatus = accountStatus;

    const users = await prisma.user.findMany({
      where,
      include: {
        vehicles: {
          include: {
            vehicleType: true
          }
        },
        reservations: true
      },
      orderBy: { fullName: 'asc' }
    });

    const sanitizedUsers = users.map(user => {
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return res.status(200).json(sanitizedUsers);
  } catch (error) {
    console.error('List Users Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/users/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: 'Forbidden: You cannot access other users profiles' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        preferences: true,
        sessions: {
          where: { isRevoked: false, expiresAt: { gt: new Date() } },
          orderBy: { lastActiveAt: 'desc' }
        },
        vehicles: {
          include: {
            vehicleType: true
          }
        },
        reservations: {
          include: {
            slot: {
              include: {
                location: true
              }
            },
            vehicle: true
          },
          orderBy: { startTime: 'desc' }
        },
        activities: {
          orderBy: { occurredAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Ensure user has a preference record
    if (!user.preferences) {
      user.preferences = await prisma.userPreference.create({
        data: { userId: id }
      });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Get User Profile Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PATCH /api/users/:id
router.patch('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName, phone, company, address, city, state, zipCode, profilePictureUrl,
      // Preference fields
      emailNotifications, smsNotifications, pushNotifications, marketingEmails,
      reservationReminders, paymentAlerts, profileVisibility, showReservationHistory,
      allowDataCollection, allowThirdPartySharing
    } = req.body;

    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden: You cannot edit other users profiles' });
    }

    // Update User table
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

    // Check if any preference fields are provided
    const prefData = {};
    if (emailNotifications !== undefined) prefData.emailNotifications = emailNotifications;
    if (smsNotifications !== undefined) prefData.smsNotifications = smsNotifications;
    if (pushNotifications !== undefined) prefData.pushNotifications = pushNotifications;
    if (marketingEmails !== undefined) prefData.marketingEmails = marketingEmails;
    if (reservationReminders !== undefined) prefData.reservationReminders = reservationReminders;
    if (paymentAlerts !== undefined) prefData.paymentAlerts = paymentAlerts;
    if (profileVisibility !== undefined) prefData.profileVisibility = profileVisibility;
    if (showReservationHistory !== undefined) prefData.showReservationHistory = showReservationHistory;
    if (allowDataCollection !== undefined) prefData.allowDataCollection = allowDataCollection;
    if (allowThirdPartySharing !== undefined) prefData.allowThirdPartySharing = allowThirdPartySharing;

    if (Object.keys(prefData).length > 0) {
      await prisma.userPreference.upsert({
        where: { userId: id },
        update: prefData,
        create: {
          userId: id,
          ...prefData
        }
      });
    }

    // Fetch user with fully populated relations
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        preferences: true,
        sessions: {
          where: { isRevoked: false, expiresAt: { gt: new Date() } }
        }
      }
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Update User Profile/Preferences Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/users/:id/change-password
router.post('/:id/change-password', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Current password and new password are required' });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Incorrect current password' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { passwordHash }
    });

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/users/:id/sessions
router.get('/:id/sessions', protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const sessions = await prisma.userSession.findMany({
      where: { userId: id, isRevoked: false, expiresAt: { gt: new Date() } },
      orderBy: { lastActiveAt: 'desc' }
    });

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = token ? jwt.decode(token) : null;
    const currentSessionId = decoded ? decoded.sessionId : null;

    const formattedSessions = sessions.map(session => ({
      id: session.id,
      device: session.device || 'Unknown Device',
      browser: session.browser || 'Unknown Browser',
      ipAddress: session.ipAddress || 'Unknown IP',
      location: session.location || 'Unknown Location',
      lastActive: session.lastActiveAt,
      isCurrent: session.id === currentSessionId,
    }));

    return res.status(200).json(formattedSessions);
  } catch (error) {
    console.error('Get Active Sessions Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/users/:id/sessions/:sessionId
router.delete('/:id/sessions/:sessionId', protect, async (req, res) => {
  try {
    const { id, sessionId } = req.params;

    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    await prisma.userSession.update({
      where: { id: sessionId },
      data: { isRevoked: true }
    });

    const redisKey = `session:${id}:${sessionId}`;
    await redisClient.del(redisKey);

    return res.status(200).json({ success: true, message: 'Session revoked successfully' });
  } catch (error) {
    console.error('Revoke Session Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/users/:id/sessions (revoke all other sessions)
router.delete('/:id/sessions', protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = token ? jwt.decode(token) : null;
    const currentSessionId = decoded ? decoded.sessionId : null;

    const otherSessions = await prisma.userSession.findMany({
      where: {
        userId: id,
        id: { not: currentSessionId || undefined },
        isRevoked: false
      }
    });

    for (const session of otherSessions) {
      await prisma.userSession.update({
        where: { id: session.id },
        data: { isRevoked: true }
      });
      const redisKey = `session:${id}:${session.id}`;
      await redisClient.del(redisKey);
    }

    return res.status(200).json({ success: true, message: 'All other sessions revoked successfully' });
  } catch (error) {
    console.error('Revoke All Sessions Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// DELETE /api/users/:id (delete account/soft delete)
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    
    // Revoke all sessions in DB
    await prisma.userSession.updateMany({
      where: { userId: id },
      data: { isRevoked: true }
    });
    
    // Revoke sessions in Redis
    const keys = await redisClient.keys(`session:${id}:*`);
    if (keys && keys.length > 0) {
      await redisClient.del(keys);
    }

    // Soft delete / deactivate the user account
    await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        accountStatus: 'DEACTIVATED'
      }
    });

    return res.status(200).json({ success: true, message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Delete Account Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /api/users/:id/reservations
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

// PATCH /api/users/:id/suspend
router.patch('/:id/suspend', protect, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin or Officer access only' });
    }

    const { id } = req.params;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        accountStatus: 'SUSPENDED',
        isActive: false
      }
    });

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('Suspend User Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PATCH /api/users/:id/activate
router.patch('/:id/activate', protect, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'OFFICER') {
      return res.status(403).json({ success: false, error: 'Forbidden: Admin or Officer access only' });
    }

    const { id } = req.params;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        accountStatus: 'ACTIVE',
        isActive: true
      }
    });

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('Activate User Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
