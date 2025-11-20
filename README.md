# Workspace Booking & Pricing System

A full-stack workspace booking system with dynamic pricing, conflict prevention, and admin analytics.

## 🚀 Tech Stack

- **Backend:** Node.js + TypeScript + Express
- **Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Database:** In-memory (easily replaceable with PostgreSQL/MongoDB)

## ✨ Features

### Core Functionality
- ✅ **Room Management** - Browse available meeting rooms with capacity and pricing
- ✅ **Smart Booking** - Book rooms with real-time conflict detection
- ✅ **Dynamic Pricing** - Automatic peak/off-peak hour pricing (1.5× during peak hours)
- ✅ **Booking Management** - View, filter, and cancel bookings
- ✅ **Cancellation Policy** - Must cancel 2+ hours before start time
- ✅ **Admin Dashboard** - Analytics, revenue tracking, and utilization metrics

### Peak Hours
- **Morning:** 10 AM - 1 PM (Mon-Fri)
- **Evening:** 4 PM - 7 PM (Mon-Fri)
- **Multiplier:** 1.5× base rate

## 📁 Project Structure

```
/backend          # Node.js API server
  /src
    /config       # Configuration and constants
    /controllers  # HTTP request handlers
    /services     # Business logic layer
    /models       # Data models and database
    /routes       # API routes
    /types        # TypeScript type definitions
    /utils        # Helper functions
/frontend         # React application
  /src
    /components   # Reusable UI components
      /ui         # shadcn/ui base components
    /pages        # Page components
    /services     # API service layer
    /lib          # Utilities and helpers
    /types        # TypeScript type definitions
README.md         # This file
ARCHITECTURE.md   # Technical architecture documentation
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend will start on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🌐 Live Deployment

- **Frontend:** [Deploy on Netlify/Vercel]
- **Backend API:** [Deploy on Render/Railway]

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 📍 Rooms

**GET /api/rooms**
```bash
curl http://localhost:5000/api/rooms
```
Response: List of all rooms with pricing and capacity

**GET /api/rooms/:id**
```bash
curl http://localhost:5000/api/rooms/101
```
Response: Specific room details

#### 📍 Bookings

**POST /api/bookings**
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "101",
    "userName": "Priya Sharma",
    "startTime": "2025-11-25T04:30:00.000Z",
    "endTime": "2025-11-25T07:30:00.000Z"
  }'
```
Response: Booking confirmation with total price

**GET /api/bookings**
```bash
curl http://localhost:5000/api/bookings
```
Response: List of all bookings

**POST /api/bookings/:id/cancel**
```bash
curl -X POST http://localhost:5000/api/bookings/b_abc123/cancel
```
Response: Cancellation confirmation

#### 📍 Analytics

**GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD**
```bash
curl "http://localhost:5000/api/analytics?from=2025-11-20&to=2025-11-25"
```
Response: Room-wise analytics with hours and revenue

**GET /api/analytics/overview?from=YYYY-MM-DD&to=YYYY-MM-DD**
```bash
curl "http://localhost:5000/api/analytics/overview?from=2025-11-20&to=2025-11-25"
```
Response: Overall statistics and summary

## 🎨 Frontend Pages

1. **Home** (`/`) - Landing page with feature overview
2. **Rooms** (`/rooms`) - Browse rooms and create bookings
3. **Bookings** (`/bookings`) - Manage your bookings
4. **Admin** (`/admin`) - Analytics dashboard

## 🧪 Testing the Application

### Create a Booking
1. Navigate to `/rooms`
2. Select a room
3. Fill in your name and time slots
4. View estimated price (considers peak hours)
5. Submit booking

### View Bookings
1. Navigate to `/bookings`
2. See all bookings in table (desktop) or cards (mobile)
3. Filter by status (All, Confirmed, Cancelled)
4. Cancel future bookings (with 2-hour minimum notice)

### Check Analytics
1. Navigate to `/admin`
2. Select date range
3. View revenue, hours, and utilization metrics
4. See room-wise performance breakdown

## 🔑 Key Features

### Conflict Prevention
- Real-time validation prevents double bookings
- Checks only CONFIRMED bookings
- Edge case: If booking A ends at 11:00 AM, booking B can start at 11:00 AM

### Dynamic Pricing Algorithm
1. Split booking into hourly slots
2. Check each slot against peak hours
3. Apply 1.5× multiplier for peak slots
4. Sum all slot prices for total

### Cancellation Policy
- Must cancel ≥ 2 hours before start time
- Cannot cancel past or ongoing bookings
- Cannot cancel already cancelled bookings

## 🚀 Deployment Guide

### Backend Deployment (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend Deployment (Netlify/Vercel)
1. Push code to GitHub
2. Connect repository to Netlify/Vercel
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_BASE_URL=<backend-url>`
6. Deploy

## 🤖 AI Usage

This project was built with AI assistance (ChatGPT/Claude) for:
- Boilerplate code generation
- TypeScript type definitions
- Component structure suggestions
- Best practices recommendations

All code has been reviewed, tested, and refactored for clarity and maintainability.

## 📝 License

GPL