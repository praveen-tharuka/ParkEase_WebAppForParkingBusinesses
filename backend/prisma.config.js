// Prisma v7 runtime config (CommonJS)
const path = require('path');

module.exports = {
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'node prisma/seed.ts',
  },
};