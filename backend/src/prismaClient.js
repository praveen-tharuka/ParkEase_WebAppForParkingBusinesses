/**
 * Shared Prisma Client instance.
 * Prisma v7 requires an explicit driver adapter — it no longer reads
 * DATABASE_URL automatically inside PrismaClient(), so we wire it here.
 */
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

module.exports = prisma;