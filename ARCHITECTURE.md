# Architecture Documentation

## 📋 Overview

This document outlines the technical architecture, design decisions, and implementation details of the Workspace Booking System.

## 🗄️ Data Model

### Room
```typescript
{
  id: string;
  name: string;
  baseHourlyRate: number;
  capacity: number;
}
```

### Booking
```typescript
{
  id: string;
  roomId: string;
  userName: string;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: Date;
}
```

## 🏗️ Backend Architecture

### Layer Structure
```
Routes → Controllers → Services → Models
```

- **Routes:** Define API endpoints
- **Controllers:** Handle HTTP requests/responses
- **Services:** Business logic (pricing, conflict detection)
- **Models:** Data access layer

## 💰 Dynamic Pricing Logic

**Peak Hours:** 10 AM - 1 PM & 4 PM - 7 PM (Mon-Fri)
- Rate: `baseHourlyRate × 1.5`

**Off-Peak:** All other times
- Rate: `baseHourlyRate`

### Algorithm
1. Split booking into hourly slots
2. Check each slot against peak hours
3. Apply appropriate multiplier
4. Sum all slot prices

## 🔒 Conflict Prevention

Bookings overlap if:
```
newStart < existingEnd AND newEnd > existingStart
```

We check all CONFIRMED bookings for the same room before creating new ones.

## 📊 Analytics Calculation

- Filter bookings by date range
- Include only CONFIRMED status
- Group by roomId
- Sum hours and revenue per room

## 🚀 Scalability Considerations

[To be detailed during implementation]

## 🤖 AI Usage Notes

[Will document AI assistance areas as development progresses]

## 🔄 Future Enhancements

- Add user authentication
- Implement payment gateway
- Add email notifications
- Real-time availability updates