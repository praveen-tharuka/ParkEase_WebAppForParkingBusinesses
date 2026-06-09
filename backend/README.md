# ParkEase Backend — Database Starter Kit

This folder provides a **database-first starter** for backend development using:
- **PostgreSQL 16** — Primary database
- **Redis 7** — Session store / caching
- **Prisma ORM v7** — Schema, migrations, type-safe client

## What's Included

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Normalized database schema (17 models, 12 enums) |
| `prisma/prisma.config.js` | Prisma v7 runtime config (datasource adapter) |
| `prisma/seed.ts` | Seed data mirroring all frontend mock data |
| `docker-compose.yml` | Postgres + Redis + Backend service |
| `Dockerfile` | Multi-stage build (dev + production targets) |
| `.env` / `.env.example` | Environment variables |
| `src/index.js` | Placeholder server (replace with your app) |

---

## Quick Start

### Option A: Full Docker (recommended for first run)

```bash
cd backend
docker compose up -d
```

This will:
1. Start Postgres + Redis containers
2. Build the backend image
3. Auto-push the Prisma schema to Postgres
4. Start the placeholder server on port 3000

Then seed the database:
```bash
npm install
npx prisma db seed
```

### Option B: Local development (Postgres in Docker, app locally)

```bash
cd backend

# 1. Start only Postgres + Redis
docker compose up -d postgres redis

# 2. Install deps
npm install

# 3. Generate Prisma client, push schema, seed data
npm run setup

# 4. Start the app
npm start
```

### Option C: Windows one-click setup (run as Administrator)

```powershell
powershell -ExecutionPolicy Bypass -File .\setup-docker-and-db.ps1
```

---

## Useful Commands

| Command | What it does |
|---------|-------------|
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:validate` | Validate schema syntax |
| `npm run prisma:format` | Auto-format schema |
| `npm run db:push` | Push schema to DB (no migration history) |
| `npm run db:migrate` | Create a migration |
| `npm run db:seed` | Run the seed script |
| `npm run db:reset` | Reset DB + re-seed |
| `npm run db:studio` | Open Prisma Studio (GUI for browsing data) |
| `npm run setup` | Install + generate + push + seed (all-in-one) |

---

## Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@parkease.com` | `admin123` |
| Officer | `r.silva@parkease.com` | `officer123` |
| Officer | `n.jayasuriya@parkease.com` | `officer123` |
| Customer | `praveen@parkease.com` | `password123` |
| Customer | `ayesha.perera@example.com` | `password123` |
| Customer | `nimal.fernando@example.com` | `password123` |
| Customer | `sithum.w@example.com` | `password123` |
| Customer | `kavindu.j@example.com` | `password123` |

> ⚠️ Passwords are stored as plaintext placeholders (`hashed_xxx_replace_with_bcrypt`). Replace `fakePasswordHash()` in `seed.ts` with **bcrypt** before any real use.

---

## Database Schema Overview

### Core Models (17 total)

```
User ──────────── Central user model (CUSTOMER / OFFICER / ADMIN via Role enum)
StaffAccount ──── Links officers/admins to the admin who manages them
ParkingLocation ─ Physical parking facility (Downtown, Airport, etc.)
ParkingSlot ───── Individual parking spot within a location
VehicleType ───── Car, SUV, Motorcycle, Truck, Van, Hatchback, Bus
Vehicle ────────── Registered vehicle with plate number
FeeStructure ──── Pricing rules per vehicle type (hourly/daily rates)
Reservation ───── Customer booking (PENDING → CONFIRMED → CHECKED_IN → COMPLETED)
ParkingTicket ──── Physical/digital ticket for a parking session
Payment ────────── Payment record (linked to ticket or reservation)
Receipt ────────── Generated receipt for a completed payment
ApprovalRequest ── Customer registration approval workflow
ApprovalDocument ─ Supporting documents for an approval request
UserActivity ──── Timeline of customer actions (audit log)
UserPreference ── Notification & privacy settings per user
UserSession ───── JWT refresh token sessions (for Redis-backed auth)
SystemSetting ──── Global application configuration
Report ─────────── Generated admin reports (revenue, occupancy, etc.)
```

### Key Design Decisions

1. **Single `User` table** with `Role` enum — NOT separate Customer/Admin/Officer tables. This simplifies authentication and makes role-based guards straightforward.

2. **`ReservationStatus` lifecycle**: `PENDING → CONFIRMED → CHECKED_IN → COMPLETED` (with `CANCELLED` as terminal). Statuses like "upcoming" or "active" should be **derived in the API layer** from `startTime`/`endTime` relative to `now()`.

3. **Prisma v7 config**: The database URL is NOT in `schema.prisma` — it's in `prisma.config.js` via the adapter pattern. This is the correct approach for Prisma v7.

4. **Currency**: Defaults to `LKR` (Sri Lankan Rupee). All monetary fields use `Decimal(10,2)`.

---

## Next Steps for Backend Team

### 1. Scaffold your framework
```bash
# Example with NestJS:
npx @nestjs/cli new . --skip-git --package-manager npm
```

Recommended modules:
- `auth` — JWT login/signup, refresh tokens via `UserSession` + Redis
- `users` — Profile CRUD, suspension, activation
- `vehicles` — Vehicle CRUD, verification
- `slots` — Slot CRUD, availability search
- `reservations` — Booking lifecycle
- `payments` — Payment processing, receipts
- `tickets` — Ticket generation, entry code verification
- `approvals` — Customer registration approval workflow
- `reports` — Revenue/occupancy report generation
- `settings` — System settings CRUD

### 2. Implement auth
- Use `UserSession` table + Redis for refresh token rotation
- Hash passwords with **bcrypt** (replace the placeholder in seed)
- Implement role guards: `@Roles(Role.ADMIN)`, `@Roles(Role.OFFICER)`, etc.
- Frontend stores token as `parkease_token` in localStorage

### 3. Build API endpoints
The frontend API layer is already defined in `frontend/src/services/api.js`. Match these endpoints exactly — see the **Field Mapping Guide** below.

### 4. Replace `src/index.js`
The current placeholder just responds with a JSON health check. Replace it with your actual NestJS/Express entrypoint.

---

## Field Mapping Guide

The frontend uses denormalized shapes (flat objects with friendly names). The database is normalized. The backend API must transform between them.

### User / Customer

| Frontend Field | Source | Notes |
|---|---|---|
| `id` | `User.id` | |
| `name` | `User.fullName` | |
| `email` | `User.email` | |
| `phone` | `User.phone` | |
| `role` | `User.role` | Frontend uses `'user'`/`'admin'`; map to `CUSTOMER`/`ADMIN` |
| `profilePicture` | `User.profilePictureUrl` | |
| `company` | `User.company` | |
| `status` | `User.accountStatus` | Frontend uses `'Approved'`/`'Pending Approval'`/`'Suspended'`; map to enum |
| `joinedAt` | `User.registrationDate` | |
| `lastVisit` | Derive from latest `UserActivity` or `ParkingTicket.checkInTime` | |
| `vehicles` (count) | `COUNT(Vehicle WHERE customerId = user.id)` | |
| `history` | `UserActivity[]` ordered by `occurredAt DESC` | |
| `vehiclesList` | `Vehicle[]` with joined `VehicleType.name` | |
| `approvalBy` | `User.approvedBy.fullName` | Join on `approvedById` |

### Vehicle

| Frontend Field | Source | Notes |
|---|---|---|
| `id` | `Vehicle.id` | |
| `licensePlate` / `plate` | `Vehicle.plateNumber` | ⚠️ Different name |
| `make` | `Vehicle.make` | |
| `model` | `Vehicle.model` | |
| `year` | `Vehicle.year` | |
| `color` | `Vehicle.color` | |
| `type` | `VehicleType.name` | Join via `vehicleTypeId` |
| `status` | `Vehicle.status` | Map enum to `'Active'`/`'Pending'`/`'Suspended'` |
| `customerName` | `Vehicle.customer.fullName` | |
| `slot` | Derive from active `ParkingTicket` for this vehicle | |

### Parking Slot

| Frontend Field | Source | Notes |
|---|---|---|
| `id` | `ParkingSlot.id` | |
| `slotNumber` | `ParkingSlot.slotNumber` | |
| `type` | `VehicleType.name` via `supportedVehicleTypeId` | |
| `location` | `ParkingLocation.name` via `locationId` | |
| `available` | `ParkingSlot.status === 'AVAILABLE'` | Boolean derived from enum |
| `price.hourly` | `FeeStructure.hourlyRate` | Join via vehicle type + active fee |
| `price.daily` | `FeeStructure.dailyRate` | Join via vehicle type + active fee |

### Booking / Reservation

| Frontend Field | Source | Notes |
|---|---|---|
| `id` | `Reservation.reservationCode` | Frontend uses code, not cuid |
| `customerId` | `Reservation.customerId` | |
| `customerName` | `Reservation.customer.fullName` | Join |
| `customerEmail` | `Reservation.customer.email` | Join |
| `slotNumber` | `Reservation.slot.slotNumber` | Join |
| `slotLocation` | `ParkingLocation.name` via slot | Join chain |
| `vehiclePlate` | `Vehicle.plateNumber` | Join via `vehicleId` |
| `vehicleType` | `VehicleType.name` | Join chain |
| `bookingDate` | `Reservation.reservationDate` | |
| `checkInTime` | `ParkingTicket.checkInTime` | Via ticket relation |
| `checkOutTime` | `ParkingTicket.checkOutTime` | Via ticket relation |
| `duration` | Computed from `checkInTime` / `checkOutTime` | |
| `price` | `Reservation.totalFee` | |
| `status` | `Reservation.status` | Map enum to `'Active'`/`'Completed'`/etc. |
| `paymentStatus` | `Payment.paymentStatus` | Via payments relation |

### Approval Request

| Frontend Field | Source | Notes |
|---|---|---|
| `id` | `ApprovalRequest.approvalCode` | |
| `name` | `ApprovalRequest.requestedBy.fullName` | Join |
| `email` | `ApprovalRequest.requestedBy.email` | Join |
| `phone` | `ApprovalRequest.requestedBy.phone` | Join |
| `vehicle.plate` | `ApprovalRequest.vehiclePlate` | Denormalized on request |
| `vehicle.type` | `ApprovalRequest.vehicleTypeName` | |
| `vehicle.color` | `ApprovalRequest.vehicleColor` | |
| `vehicle.make` | `ApprovalRequest.vehicleMake` | |
| `documents` | `ApprovalDocument[].documentType` | |
| `approvalStatus` | `ApprovalRequest.status` | |

---

## Frontend API Endpoints Reference

The frontend expects these endpoints (from `frontend/src/services/api.js`):

| Method | Endpoint | Models Involved |
|--------|----------|-----------------|
| POST | `/auth/signup` | User |
| POST | `/auth/login` | User, UserSession |
| POST | `/auth/logout` | UserSession |
| POST | `/auth/refresh` | UserSession |
| GET | `/auth/me` | User |
| GET | `/slots?filters` | ParkingSlot, ParkingLocation, FeeStructure |
| GET | `/slots/:id` | ParkingSlot |
| POST | `/slots` | ParkingSlot (admin) |
| PATCH | `/slots/:id` | ParkingSlot (admin) |
| DELETE | `/slots/:id` | ParkingSlot (admin) |
| POST | `/slots/check-availability` | ParkingSlot, Reservation |
| POST | `/reservations` | Reservation |
| GET | `/reservations/:id` | Reservation |
| GET | `/users/:id/reservations` | Reservation |
| PATCH | `/reservations/:id` | Reservation |
| PATCH | `/reservations/:id/cancel` | Reservation |
| GET | `/reservations?filters` | Reservation |
| POST | `/payments` | Payment |
| GET | `/payments/:id` | Payment |
| POST | `/payments/:id/refund` | Payment |
| GET | `/users/:id/payments?filters` | Payment |
| POST | `/reservations/:id/ticket` | ParkingTicket |
| GET | `/reservations/:id/ticket` | ParkingTicket |
| POST | `/tickets/verify-entry` | ParkingTicket |
| GET | `/users/:id/vehicles` | Vehicle |
| GET | `/vehicles/:id` | Vehicle |
| POST | `/vehicles` | Vehicle |
| PATCH | `/vehicles/:id` | Vehicle |
| DELETE | `/vehicles/:id` | Vehicle |
| PATCH | `/vehicles/:id/verify` | Vehicle |
| GET | `/users/:id` | User |
| PATCH | `/users/:id` | User |
| PATCH | `/users/:id/suspend` | User |
| PATCH | `/users/:id/activate` | User |
| GET | `/approvals/pending?filters` | ApprovalRequest |
| POST | `/approvals/:id/approve` | ApprovalRequest, User, Vehicle |
| POST | `/approvals/:id/reject` | ApprovalRequest |
| GET | `/approvals/:id` | ApprovalRequest |
| GET | `/reports/overview?filters` | Aggregated queries |
| GET | `/reports/revenue?from&to` | Payment, Reservation |
| GET | `/reports/occupancy?filters` | ParkingSlot, ParkingTicket |
| GET | `/reports/user-growth` | User |
| POST | `/walkins` | ParkingTicket, Vehicle |
| GET | `/walkins?filters` | ParkingTicket |
