/**
 * ParkEase Backend — Entrypoint
 *
 * This is a minimal placeholder server so the Docker container starts
 * without errors. Backend devs should replace this with their full
 * NestJS / Express scaffold.
 */

const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      service: 'ParkEase Backend',
      status: 'running',
      database: 'PostgreSQL (Prisma)',
      message:
        'Database is ready. Replace this placeholder with your NestJS/Express app.',
    })
  );
});

server.listen(PORT, () => {
  console.log(`🚀 ParkEase backend placeholder running on port ${PORT}`);
  console.log(`   Database schema has been pushed via Prisma.`);
  console.log(`   Replace src/index.js with your actual application.`);
});
