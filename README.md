# 🚗 ParkEase - Smart Parking Management System

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.5-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748.svg?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1.svg?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED.svg?logo=docker)](https://www.docker.com/)

ParkEase is a modern, enterprise-ready parking management system. It features a responsive React client portal for vehicle owners to search locations and reserve spots, alongside a modular database-first backend service using Prisma, PostgreSQL, and Redis to organize system metadata, roles, and occupancy logs.

---

## 📖 Table of Contents

- [🚀 Key Features](#-key-features)
  - [Client Portal (Frontend)](#client-portal-frontend)
  - [Management & Administration](#management--administration)
  - [Database & Services (Backend)](#database--services-backend)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (Docker & Database)](#backend-setup-docker--database)
  - [Frontend Setup (Client UI)](#frontend-setup-client-ui)
- [🔑 Test Accounts & Credentials](#-test-accounts--credentials)
- [🛣️ Application Routing Map](#️-application-routing-map)
- [🧬 Database Architecture & ERD](#-database-architecture--erd)
- [📄 License](#-license)

---

## 🚀 Key Features

### Client Portal (Frontend)
- **User Dashboard**: Summary counters for active bookings, total spent, vehicles registered, and a dynamic audit trail of recent activities.
- **My Vehicles**: A registry to track make, model, license plate, year, color, and status of user vehicles.
- **Spot Search & Filter**: Search engine allowing customers to locate spaces by facility name, hourly/daily price cap, and vehicle type.
- **Reservation Pipeline**:
  - `ReservationForm`: Step-by-step reservation scheduler.
  - `ReservationConfirm`: Order breakdown showing rates and details.
  - `BookingSuccess`: Success card with transaction summaries.

### Management & Administration
- **Officer & Admin Portals**: Dedicated pages to manage parking allocations, approve pending customer registration requests, oversee registered vehicles, and configure system rules.

### Database & Services (Backend)
- **Dockerized Environment**: Quick deployment configuration for PostgreSQL database and Redis caching.
- **Stateful Seeding**: Script containing comprehensive demo data mirroring customers, officers, locations, reservations, payments, and system preferences.
- **Type-safe Querying**: Prisma client configuration with database migrations support.

---

## 🛠️ Tech Stack

### Frontend Client
- **Core Library**: [React 18.2.0](https://react.dev/)
- **Build Engine**: [Vite 7.3.0](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.3.5](https://tailwindcss.com/)
- **Routing**: [React Router DOM 6.20.0](https://reactrouter.com/)
- **Animations**: [Framer Motion 10.16.4](https://www.framer.com/motion/)

### Backend Database Starter
- **Runtime**: [Node.js & TypeScript](https://www.typescriptlang.org/)
- **Primary Database**: [PostgreSQL 16](https://www.postgresql.org/)
- **Cache & Session Cache**: [Redis 7](https://redis.io/)
- **ORM**: [Prisma v7.8.0](https://www.prisma.io/)
- **Containerization**: [Docker & Docker Compose](https://www.docker.com/)

---

## 📂 Project Structure

```text
ParkEase_WebAppForParkingBusinesses/
├── README.md                    # Main Project README
├── er.txt                       # Detailed entity relationship schema description
├── visual er.txt                # Mermaid ER diagram source (Chen notation)
│
├── frontend/                    # Client UI Core
│   ├── package.json             # Frontend deps & scripts
│   ├── tailwind.config.js       # Brand color config & theme extensions
│   ├── vite.config.js           # Vite dev server and proxy targets
│   └── src/
│       ├── App.jsx              # Routing configurations
│       ├── context/             # React authentication contexts
│       ├── services/
│       │   └── api.js           # Axios API connectors mapping to the backend endpoints
│       ├── data/                # Local mock fallbacks for standalone client runs
│       ├── components/          # Reusable modules (Navbar, Sidebar, QuickStats, SlotCard)
│       └── pages/               # Views (Landing, UserDashboard, MyVehicles, ReservationFlow, Admin)
│
└── backend/                     # Server & Database Starter
    ├── package.json             # Backend script pipelines
    ├── tsconfig.json            # TypeScript compile configurations
    ├── Dockerfile               # Multi-stage container file
    ├── docker-compose.yml       # PostgreSQL, Redis, and Backend runner configuration
    ├── setup-docker-and-db.ps1  # Automated Windows Powershell environment bootstrap script
    ├── src/
    │   └── index.js             # Server placeholder (HTTP health check endpoint)
    └── prisma/
        ├── schema.prisma        # Normalized relational schema (17 models, 12 enums)
        ├── prisma.config.js     # Runtime configurations
        └── seed.ts              # Seeding script containing complex mock datasets
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Docker Desktop** (running local daemon for database containers)

---

### Backend Setup (Docker & Database)

1. **Navigate to the Backend Directory**
   ```bash
   cd backend
   ```

2. **Spin up Postgres and Redis Services**
   Use Docker Compose to build and start database containers in detached mode:
   ```bash
   docker compose up -d
   ```
   This initializes:
   - **PostgreSQL 16** on port `5432`
   - **Redis 7** on port `6379`
   - **Backend placeholder service** on port `3000`

3. **Install Dependencies & Seed Databases**
   Run the quick-setup command to install dependencies, push database schema via Prisma, and load the seed dataset:
   ```bash
   npm run setup
   ```
   *Alternatively, if Postgres is running locally outside Docker, update your connection string in `.env` and run:*
   ```bash
   npm install
   npx prisma db push
   npx prisma db seed
   ```

4. **Launch Prisma Studio (Optional GUI)**
   To browse the seeded PostgreSQL data through a web interface, run:
   ```bash
   npm run db:studio
   ```
   Open `http://localhost:5555` to view table models.

---

### Frontend Setup (Client UI)

1. **Navigate to the Frontend Directory**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Launch the Client Development Server**
   ```bash
   npm run dev
   ```
   The frontend application will start on `http://localhost:5173`.

---

## 🔑 Test Accounts & Credentials

Running the `npm run setup` / `npx prisma db seed` script populates your database with accounts across various roles:

| Role | Username / Email | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@parkease.com` | `admin123` | System management and global statistics |
| **Officer** | `r.silva@parkease.com` | `officer123` | Verify customer accounts, vehicles, and logs |
| **Officer** | `n.jayasuriya@parkease.com`| `officer123` | Verify customer accounts, vehicles, and logs |
| **Customer** | `praveen@parkease.com` / `praveen` | `password123` | Reserve slots, configure vehicles, and view dashboard |
| **Customer** | `ayesha.perera@example.com` | `password123` | Secondary test client |

---

## 🛣️ Application Routing Map

The frontend routing map matches endpoints configured inside client dashboards:

| Path | Component | Auth Guarded? | Purpose |
| :--- | :--- | :--- | :--- |
| `/` | `LandingPage` | No | Marketing home page |
| `/login` | `LoginPage` | No | Portal auth entrance |
| `/signup` | `SignupPage` | No | Registration interface |
| `/user-dashboard` | `UserDashboardPage` | **Yes** | User portal main dashboard |
| `/reservation/details` | `ReservationForm` | No | Spot reservation configuration |
| `/reservation/confirm` | `ReservationConfirm`| No | Costs & summaries check |
| `/reservation/success` | `BookingSuccess` | No | Confirmation check details |

---

## 🧬 Database Architecture & ERD

The database schema is defined in [`backend/prisma/schema.prisma`](./backend/prisma/schema.prisma) and consists of 17 models designed around parking processes:

- **Auth & Accounts**: `User` table (handles CUSTOMER, OFFICER, and ADMIN roles) + `StaffAccount` + `UserSession` (JWT state tracker).
- **Facilities & Inventory**: `ParkingLocation` (coordinates parking facilities) + `ParkingSlot` (individual spaces).
- **Rules & Prices**: `FeeStructure` (defines hourly/daily rates per vehicle type) + `VehicleType`.
- **Transactions & Bookings**: `Reservation` (manages lifecycle `PENDING -> CONFIRMED -> CHECKED_IN -> COMPLETED`) + `ParkingTicket` + `Payment` + `Receipt`.
- **Security & Workflows**: `ApprovalRequest` + `ApprovalDocument` (handling customer driver licensing validation) + `UserActivity` (audit logs).

To inspect the structural relationships, refer to:
- [**ER Diagram Specs**](./er.txt): Plain-text Chen notation.
- [**Visual ER Diagram**](./visual%20er.txt): Mermaid flowchart showing relationships and attributes.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
