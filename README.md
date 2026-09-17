# RailYatra — Backend REST API Server

> **Branch:** `backend`  
> **Parent Branch:** `main`  
> **Paired Client:** [`frontend` branch](https://github.com/nivetha-87676/train-portal-enchanced/tree/frontend)

This branch contains the **complete server-side Node.js/Express REST API** for the RailYatra Smart Indian Railway Portal. It handles train searches, ticket bookings with real PNR generation, live GPS train tracking simulation, and passenger authentication.

---

## 📁 Repository Structure (`backend` branch)

```
train-portal-enchanced/
├── config/
│   ├── config.js               # Application configuration & environment bindings
│   └── db.js                   # In-memory JSON database layer & seed loader
├── controllers/
│   ├── authController.js       # Register, login, user profiles
│   ├── bookingController.js    # PNR generation, ticket creation, lookup
│   ├── trackingController.js   # Live train status & GPS station waypoints
│   └── trainController.js      # Train catalog lookup & route search
├── data/
│   └── trains.json             # Seed database with schedules, fares, and coordinates
├── middleware/
│   ├── auth.js                 # Bearer token validation & dev fallback
│   ├── errorHandler.js         # Centralized error handler
│   └── validator.js            # Input validation for bookings & PNR
├── models/
│   ├── Booking.js              # Booking model (ticket lifecycle, PNR generator)
│   ├── Train.js                # Train model (search filters, status lookup)
│   └── User.js                 # User model (profiles & authentication)
├── routes/
│   ├── authRoutes.js           # /api/auth routes
│   ├── bookingRoutes.js        # /api/bookings routes
│   ├── trackingRoutes.js       # /api/tracking routes
│   └── trainRoutes.js          # /api/trains routes
├── .env.example                # Template for environment variables
├── .gitignore                  # Backend ignore rules (node_modules, .env, logs)
├── package.json                # Node dependencies and scripts
├── README.md                   # This documentation
└── server.js                   # Main application entry point
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

### 2. Installation
Clone the repository and switch to the `backend` branch:

```bash
git clone https://github.com/nivetha-87676/train-portal-enchanced.git
cd train-portal-enchanced
git checkout backend
```

Install server dependencies:

```bash
npm install
```

### 3. Environment Setup
Copy the sample environment file:

```bash
cp .env.example .env
```

Default configuration in `.env`:
```ini
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:8000,http://localhost:8080
JWT_SECRET=railyatra_super_secret_jwt_key_change_in_production
```

### 4. Run the Server

**Production / Normal Mode:**
```bash
npm start
```

**Development Mode (auto-restart on changes):**
```bash
npm run dev
```

The API will be available at:
`http://localhost:5000`

---

## 📡 REST API Reference

### Health Check
- `GET /` — API root service status and endpoint directory
- `GET /api/health` — System uptime and health metric

---

### 1. Trains API (`/api/trains`)

#### Search Trains
```http
GET /api/trains/search?from=NDLS&to=BSB&classType=CC
```
**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "22436",
      "trainNumber": "22436",
      "name": "Vande Bharat Express",
      "from": "NDLS",
      "fromStation": "New Delhi",
      "to": "BSB",
      "toStation": "Varanasi Junction",
      "departureTime": "06:00",
      "arrivalTime": "14:00",
      "classes": [
        { "code": "CC", "name": "AC Chair Car", "fare": 1750, "availableSeats": 42 },
        { "code": "EC", "name": "Executive Anubhuti", "fare": 3300, "availableSeats": 12 }
      ]
    }
  ]
}
```

#### Get All Trains
```http
GET /api/trains
```

#### Get Train by ID or Train Number
```http
GET /api/trains/22436
```

---

### 2. Booking API (`/api/bookings`)

#### Book Ticket (Create PNR)
```http
POST /api/bookings
Content-Type: application/json

{
  "trainNumber": "22436",
  "from": "NDLS",
  "to": "BSB",
  "travelDate": "2026-09-20",
  "classType": "CC",
  "passengers": [
    { "name": "Aarav Sharma", "age": 28, "gender": "Male", "berthPreference": "Window" }
  ],
  "totalFare": 1750,
  "paymentMethod": "UPI"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Ticket booked successfully!",
  "data": {
    "id": "bkg_1726555200000",
    "pnr": "4829103847",
    "trainNumber": "22436",
    "trainName": "Vande Bharat Express",
    "ticketStatus": "CONFIRMED",
    "passengers": [
      {
        "name": "Aarav Sharma",
        "age": 28,
        "seatNumber": "CC-12",
        "status": "CNF"
      }
    ],
    "totalFare": 1750,
    "paymentStatus": "COMPLETED"
  }
}
```

#### Check PNR Status
```http
GET /api/bookings/pnr/4829103847
```

#### User's Bookings
```http
GET /api/bookings/my
Headers:
  Authorization: Bearer <token>
```

---

### 3. Live Train Tracking (`/api/tracking`)

#### Live Running Status
```http
GET /api/tracking/22436
```
**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "trainNumber": "22436",
    "name": "Vande Bharat Express",
    "status": "On Time",
    "delayMinutes": 0,
    "currentStation": "CNB",
    "currentStationName": "Kanpur Central",
    "speedKmH": 130,
    "lastUpdated": "Just now"
  }
}
```

#### Station GPS Waypoints & Halts
```http
GET /api/tracking/22436/stations
```

---

### 4. Authentication API (`/api/auth`)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "Password123!",
  "phone": "+91 9876543210"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "aarav@example.com",
  "password": "Password123!"
}
```

---

## 🔗 Integration with Frontend

The frontend client on branch `frontend` communicates with this backend server via HTTP fetch requests directed to:
`http://localhost:5000/api/*`

CORS is enabled by default for `http://localhost:8000` and `http://localhost:8080`.

---

## 📄 License
ISC License — RailYatra Team 2026.