const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/parkease?schema=public',
  },
  migrations: {
    seed: 'npx ts-node prisma/seed.ts',
  },
});
