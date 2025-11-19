# Workspace Booking & Pricing System

A full-stack workspace booking system with dynamic pricing, conflict prevention, and admin analytics.

## 🚀 Tech Stack

- **Backend:** Node.js + TypeScript + Express
- **Frontend:** React + TypeScript + Vite
- **Database:** PostgreSQL (or in-memory for quick setup)

## 📁 Project Structure

```
/backend          # Node.js API server
/frontend         # React application
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

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Live Deployment

- **Frontend:** [Coming Soon]
- **Backend API:** [Coming Soon]

## 📚 API Documentation

### Endpoints

#### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "roomId": "101",
  "userName": "Priya",
  "startTime": "2025-11-20T10:00:00.000Z",
  "endTime": "2025-11-20T12:30:00.000Z"
}
```

#### Cancel Booking
```http
POST /api/bookings/:id/cancel
```

#### Get Analytics
```http
GET /api/analytics?from=2025-11-20&to=2025-11-25
```

## 🧪 Development

More details coming as development progresses...

## 📝 License

GPL-V3