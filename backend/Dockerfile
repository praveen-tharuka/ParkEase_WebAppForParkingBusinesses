# ── ParkEase Backend ──
# Multi-stage build: installs deps, generates Prisma client,
# then runs migrations + seeds + starts the app.

# ---------- base ----------
FROM node:20-alpine AS base
WORKDIR /app

# ---------- deps ----------
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# ---------- build ----------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate the Prisma client so it is available at runtime
RUN npx prisma generate

# ---------- production ----------
FROM base AS production
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/src ./src
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

# On startup: push schema to the database (idempotent) then launch the server.
# Backend devs will replace the CMD once they scaffold the actual app entrypoint.
CMD ["sh", "-c", "npx prisma db push --skip-generate && node src/index.js"]

# ---------- development (default target for docker compose) ----------
FROM base AS development
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate

EXPOSE 3000

# In dev mode: push schema then start with a watcher (or plain node for now)
CMD ["sh", "-c", "npx prisma db push --skip-generate && node src/index.js"]
