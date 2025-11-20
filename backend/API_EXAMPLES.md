# API Examples

## Booking Endpoints

### 1. Create a Booking

**Success Case:**
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

**Expected Response (201):**
```json
{
  "bookingId": "b_abc123",
  "roomId": "101",
  "userName": "Priya Sharma",
  "totalPrice": 2250,
  "status": "CONFIRMED"
}
```

**Conflict Case:**
```bash
# Try to book the same room at overlapping time
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "101",
    "userName": "Rahul Kumar",
    "startTime": "2025-11-25T05:00:00.000Z",
    "endTime": "2025-11-25T08:00:00.000Z"
  }'
```

**Expected Response (409):**
```json
{
  "error": "Room already booked from 10:00 AM, 25 Nov 2025 to 01:00 PM, 25 Nov 2025"
}
```

### 2. Cancel a Booking

**Success Case:**
```bash
curl -X POST http://localhost:5000/api/bookings/b_abc123/cancel
```

**Expected Response (200):**
```json
{
  "message": "Booking cancelled successfully",
  "booking": {
    "bookingId": "b_abc123",
    "roomId": "101",
    "userName": "Priya Sharma",
    "status": "CANCELLED",
    "startTime": "2025-11-25T04:30:00.000Z",
    "endTime": "2025-11-25T07:30:00.000Z"
  }
}
```

**Too Late to Cancel:**
```bash
# Try to cancel within 2 hours of start time
curl -X POST http://localhost:5000/api/bookings/b_xyz789/cancel
```

**Expected Response (400):**
```json
{
  "error": "Cancellation must be made at least 2 hours before the booking start time. Time remaining: 1.5 hours"
}
```

### 3. Get All Bookings

```bash
curl http://localhost:5000/api/bookings
```

**Expected Response (200):**
```json
[
  {
    "id": "b_abc123",
    "roomId": "101",
    "userName": "Priya Sharma",
    "startTime": "2025-11-25T04:30:00.000Z",
    "endTime": "2025-11-25T07:30:00.000Z",
    "totalPrice": 2250,
    "status": "CONFIRMED",
    "createdAt": "2025-11-20T10:30:00.000Z"
  }
]
```

### 4. Get Specific Booking

```bash
curl http://localhost:5000/api/bookings/b_abc123
```

### 5. Get Bookings by Room

```bash
curl http://localhost:5000/api/bookings/room/101
```

## Room Endpoints

### 1. Get All Rooms

```bash
curl http://localhost:5000/api/rooms
```

**Expected Response (200):**
```json
[
  {
    "id": "101",
    "name": "Conference Room A",
    "baseHourlyRate": 500,
    "capacity": 10
  },
  {
    "id": "102",
    "name": "Meeting Pod B",
    "baseHourlyRate": 300,
    "capacity": 4
  }
]
```

### 2. Get Specific Room

```bash
curl http://localhost:5000/api/rooms/101
```

### 3. Get Room Statistics

```bash
curl http://localhost:5000/api/rooms/101/stats
```

**Expected Response (200):**
```json
{
  "roomId": "101",
  "roomName": "Conference Room A",
  "totalBookings": 5,
  "confirmedBookings": 3,
  "cancelledBookings": 2
}
```

## Analytics Endpoints

### 1. Get Analytics for All Rooms

```bash
curl "http://localhost:5000/api/analytics?from=2025-11-20&to=2025-11-25"
```

**Expected Response (200):**
```json
[
  {
    "roomId": "101",
    "roomName": "Conference Room A",
    "totalHours": 15.5,
    "totalRevenue": 5250
  },
  {
    "roomId": "102",
    "roomName": "Meeting Pod B",
    "totalHours": 8.0,
    "totalRevenue": 2400
  }
]
```

### 2. Get Overall Statistics

```bash
curl "http://localhost:5000/api/analytics/overview?from=2025-11-20&to=2025-11-25"
```

**Expected Response (200):**
```json
{
  "dateRange": {
    "from": "2025-11-20T00:00:00.000Z",
    "to": "2025-11-25T23:59:59.999Z"
  },
  "summary": {
    "totalRevenue": 12500,
    "totalHours": 45.5,
    "totalRooms": 5,
    "activeRooms": 3,
    "averageRevenuePerRoom": 2500
  },
  "roomBreakdown": [...]
}
```

### 3. Get Room-Specific Analytics

```bash
curl "http://localhost:5000/api/analytics/room/101?from=2025-11-20&to=2025-11-25"
```

### 4. Get Utilization Metrics

```bash
curl "http://localhost:5000/api/analytics/utilization?from=2025-11-20&to=2025-11-25"
```

**Expected Response (200):**
```json
{
  "totalBookings": 15,
  "confirmedBookings": 12,
  "cancelledBookings": 3,
  "cancellationRate": "20.00%"
}
```

## Test Endpoints (Development Only)

### Calculate Price

```bash
curl -X POST http://localhost:5000/api/test/calculate-price \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "2025-11-25T04:30:00.000Z",
    "endTime": "2025-11-25T07:30:00.000Z",
    "baseRate": 500
  }'
```

### Get Pricing Info

```bash
curl http://localhost:5000/api/test/pricing-info/500
```

## Common Error Responses

### 400 Bad Request
```json
{
  "error": "Start time must be before end time"
}
```

### 404 Not Found
```json
{
  "error": "Room with ID 999 not found"
}
```

### 409 Conflict
```json
{
  "error": "Room already booked from 10:00 AM to 11:30 AM"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create booking"
}
```