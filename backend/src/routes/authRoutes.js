const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../prisma');
const redisClient = require('../redis');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'parkease_secret_key_12345';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'parkease_refresh_key_12345';

const generateAccessToken = (user, sessionId) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      sessionId,
      nonce: crypto.randomBytes(16).toString('hex') 
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      nonce: crypto.randomBytes(16).toString('hex')
    },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, phone, company, address, city, state, zipCode } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, error: 'Email, password, and full name are required' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        fullName,
        phone,
        company,
        address,
        city,
        state,
        zipCode,
        role: 'CUSTOMER',
        accountStatus: 'PENDING_APPROVAL',
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error during signup' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase().trim() },
          { username: email.trim() }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email/username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email/username or password' });
    }

    if (user.accountStatus === 'SUSPENDED' || user.accountStatus === 'DEACTIVATED') {
      return res.status(403).json({ success: false, error: 'Account is suspended or deactivated. Contact support.' });
    }

    const rawRefreshToken = generateRefreshToken(user);
    const refreshTokenHash = hashToken(rawRefreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        expiresAt,
        device: req.headers['user-agent'] || 'Unknown Device',
        isCurrent: true,
      },
    });

    const redisKey = `session:${user.id}:${session.id}`;
    await redisClient.set(redisKey, refreshTokenHash, {
      EX: 7 * 24 * 60 * 60,
    });

    const accessToken = generateAccessToken(user, session.id);

    const { passwordHash: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      accessToken,
      refreshToken: rawRefreshToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error during login' });
  }
});

router.post('/logout', protect, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });

    if (decoded && decoded.sessionId) {
      await prisma.userSession.delete({
        where: { id: decoded.sessionId },
      }).catch(() => {});

      const redisKey = `session:${req.user.id}:${decoded.sessionId}`;
      await redisClient.del(redisKey);
    }

    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error during logout' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'Refresh token is required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
    }

    const hashedToken = hashToken(refreshToken);

    const session = await prisma.userSession.findFirst({
      where: {
        userId: decoded.id,
        refreshTokenHash: hashedToken,
        isRevoked: false,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });

    if (!session) {
      return res.status(401).json({ success: false, error: 'Session not found or token revoked' });
    }

    const redisKey = `session:${decoded.id}:${session.id}`;
    const activeTokenHash = await redisClient.get(redisKey);

    if (!activeTokenHash || activeTokenHash !== hashedToken) {
      return res.status(401).json({ success: false, error: 'Session invalidated' });
    }

    const newRawRefreshToken = generateRefreshToken(session.user);
    const newRefreshTokenHash = hashToken(newRawRefreshToken);
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    await prisma.userSession.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: newRefreshTokenHash,
        expiresAt: newExpiresAt,
        lastActiveAt: new Date(),
      }
    });

    await redisClient.del(redisKey);
    await redisClient.set(redisKey, newRefreshTokenHash, {
      EX: 7 * 24 * 60 * 60,
    });

    const newAccessToken = generateAccessToken(session.user, session.id);

    const { passwordHash: _, ...userWithoutPassword } = session.user;

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRawRefreshToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error during refresh' });
  }
});

router.get('/me', protect, async (req, res) => {
  return res.status(200).json({ user: req.user });
});

module.exports = router;
