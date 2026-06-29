const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const redisClient = require('../redis');

const JWT_SECRET = process.env.JWT_SECRET || 'parkease_secret_key_12345';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, JWT_SECRET);

      if (!decoded.sessionId) {
        return res.status(401).json({ success: false, error: 'Not authorized, invalid token payload' });
      }

      // 1. Check if session is active in Redis (Fast cache check)
      const redisKey = `session:${decoded.id}:${decoded.sessionId}`;
      const sessionActive = await redisClient.get(redisKey);

      if (!sessionActive) {
        // 2. Fallback to Database check in case Redis is empty/cleared
        const dbSession = await prisma.userSession.findUnique({
          where: { id: decoded.sessionId },
        });

        if (!dbSession || dbSession.isRevoked || dbSession.expiresAt < new Date()) {
          return res.status(401).json({ success: false, error: 'Not authorized, session expired or logged out' });
        }
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
      }

      if (user.accountStatus === 'SUSPENDED' || user.accountStatus === 'DEACTIVATED') {
        return res.status(403).json({ success: false, error: 'Account is suspended or deactivated' });
      }

      const { passwordHash, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ success: false, error: 'Access denied, admin only' });
  }
};

module.exports = { protect, adminOnly };
