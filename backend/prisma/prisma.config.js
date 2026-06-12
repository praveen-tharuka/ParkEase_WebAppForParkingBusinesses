// Prisma v7 runtime config (CommonJS)
// Supplies the datasource adapter and generator settings expected by Prisma CLI v7.
module.exports = {
  datasources: {
    db: {
      adapter: {
        type: 'postgresql',
        url: process.env.DATABASE_URL,
      },
    },
  },
  generators: {
    client: {
      provider: 'prisma-client-js',
    },
  },
};
