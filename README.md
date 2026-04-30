# CineBook - Movie Booking Reservation System

🌍 **Live Demo:** [https://cinebook-c.netlify.app/](https://cinebook-c.netlify.app/)

CineBook is a full-stack movie booking and reservation system built with a modern web architecture. It allows users to browse movies, find theaters, view showtimes, and book seats.

## 🚀 Tech Stack

### Frontend (Client)
- **Framework:** React 19 built with Vite
- **Routing:** React Router v7
- **State Management:** Zustand
- **Styling & UI:** Tailwind CSS, Framer Motion (for animations), Lucide React (for icons)
- **Utilities:** clsx, tailwind-merge

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose ODM)
- **Caching / Concurrency:** Redis (using ioredis)
- **Task Scheduling:** node-cron

## 📁 Project Structure

The project is structured as a monorepo with separate `client` and `server` directories:

```text
.
├── client/                 # React frontend application
│   ├── public/             # Static assets
│   ├── src/                # React components, pages, and store
│   ├── package.json        # Frontend dependencies and scripts
│   └── vite.config.js      # Vite configuration
└── server/                 # Node.js Express backend API
    ├── lib/                # Shared utilities (e.g., Redis config)
    ├── models/             # Mongoose database schemas
    ├── routes/             # API route handlers
    ├── index.js            # Express app entry point
    ├── seed.js             # Database seeding script
    └── package.json        # Backend dependencies and scripts
```

## 🛠️ Features

- **Movies Management:** Browse available movies with details.
- **Theaters & Showtimes:** View participating theaters and detailed showtime schedules.
- **Booking System:** Seat reservation functionality with concurrency control using Redis to prevent double bookings.
- **Health Checks:** Built-in server health check endpoint.

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v18 or higher recommended)
- MongoDB
- Redis

### Environment Variables

Navigate to the `server/` directory and set up your `.env` file based on the required environment variables (e.g., `MONGO_URI`, `PORT`, and Redis connection details).

### Installation & Running Locally

1. **Clone the repository and install dependencies:**

   **Server:**
   ```bash
   cd server
   npm install
   ```

   **Client:**
   ```bash
   cd client
   npm install
   ```

2. **Seed the database (Optional but recommended):**
   ```bash
   cd server
   npm run seed
   ```

3. **Start the development servers:**

   **Run the Server:**
   ```bash
   cd server
   npm run dev
   ```
   *The API server will typically start on `http://localhost:5000`.*

   **Run the Client:**
   ```bash
   cd client
   npm run dev
   ```
   *The React app will be available on the port specified by Vite (usually `http://localhost:5173`).*

