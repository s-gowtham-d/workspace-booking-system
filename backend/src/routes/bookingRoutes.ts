import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';

const router = Router();

/**
 * Booking Routes
 */

// POST /api/bookings - Create a new booking
router.post('/', (req, res) => bookingController.createBooking(req, res));

// POST /api/bookings/:id/cancel - Cancel a booking
router.post('/:id/cancel', (req, res) => bookingController.cancelBooking(req, res));

// GET /api/bookings - Get all bookings
router.get('/', (req, res) => bookingController.getAllBookings(req, res));

// GET /api/bookings/:id - Get specific booking
router.get('/:id', (req, res) => bookingController.getBookingById(req, res));

// GET /api/bookings/room/:roomId - Get bookings by room
router.get('/room/:roomId', (req, res) => bookingController.getBookingsByRoom(req, res));

export default router;