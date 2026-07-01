# 💻 ParkEase - Frontend Web Application

This directory contains the user interface and frontend client codebase for **ParkEase**, built with React, Vite, and Tailwind CSS.

For the comprehensive system architecture, data models, routes map, authentication credentials, and MERN integration roadmap, please see the [**Master Root README**](../README.md).

---

## 🛠️ Frontend Tech Stack

- **Framework**: React 18.2.0
- **Build Tooling**: Vite 7.3.0
- **CSS Utility Engine**: Tailwind CSS 3.3.5
- **Animations**: Framer Motion 10.16.4
- **Routing**: React Router DOM 6.20.0

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** (version 16.0 or higher)
- **npm** (version 8.0 or higher)

### 💻 Scripts Quick Reference

Install all client packages:
```bash
npm install
```

Start the interactive development server:
```bash
npm run dev
```
The app will run on `http://localhost:5173`.

Build and compile optimization assets for production:
```bash
npm run build
```

Preview the local production build:
```bash
npm run preview
```

---

## 📂 Frontend Directory Structure Highlights

- [`src/App.jsx`](./src/App.jsx): Declares global page routes and wraps the application in the authentication context provider.
- [`src/context/AuthContext.jsx`](./src/context/AuthContext.jsx): Stores session details inside `localStorage` for testing.
- [`src/pages/`](./src/pages/): Contains view panels such as Login, Signup, Dashboard, My Vehicles, and the reservation wizard flow.
- [`src/components/`](./src/components/): Modular components (Navbar, Sidebar, search cards, filters, and landing page sections).
- [`src/data/`](./src/data/): Houses mock schema assets (`mockSlots.js` and `mockUserData.js`) simulating the server database tables.
