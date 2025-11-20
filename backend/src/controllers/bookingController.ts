import { Request, Response } from 'express';
import { bookingService } from '../services/bookingService';
import { CreateBookingRequest } from '../types';

/**
 * Booking Controller - Handles HTTP requests for booking endpoints
 */
export class BookingController {
    /**
     * POST /api/bookings
     * Create a new booking
     */
    async createBooking(req: Request, res: Response): Promise<void> {
        try {
            const bookingRequest: CreateBookingRequest = req.body;

            const result = await bookingService.createBooking(bookingRequest);

            res.status(201).json(result);
        } catch (error: any) {
            console.error('Error creating booking:', error);

            // Handle specific error types
            if (error.message.includes('not found')) {
                res.status(404).json({ error: error.message });
                return;
            }

            if (
                error.message.includes('already booked') ||
                error.message.includes('conflict') ||
                error.message.includes('overlap')
            ) {
                res.status(409).json({ error: error.message });
                return;
            }

            if (
                error.message.includes('Invalid') ||
                error.message.includes('required') ||
                error.message.includes('must be') ||
                error.message.includes('cannot exceed')
            ) {
                res.status(400).json({ error: error.message });
                return;
            }

            res.status(500).json({ error: 'Failed to create booking' });
        }
    }

    /**
     * POST /api/bookings/:id/cancel
     * Cancel a booking
     */
    async cancelBooking(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const cancelledBooking = await bookingService.cancelBooking(id);

            res.status(200).json({
                message: 'Booking cancelled successfully',
                booking: {
                    bookingId: cancelledBooking.id,
                    roomId: cancelledBooking.roomId,
                    userName: cancelledBooking.userName,
                    status: cancelledBooking.status,
                    startTime: cancelledBooking.startTime,
                    endTime: cancelledBooking.endTime
                }
            });
        } catch (error: any) {
            console.error('Error cancelling booking:', error);

            if (error.message.includes('not found')) {
                res.status(404).json({ error: error.message });
                return;
            }

            if (
                error.message.includes('already cancelled') ||
                error.message.includes('already started') ||
                error.message.includes('at least')
            ) {
                res.status(400).json({ error: error.message });
                return;
            }

            res.status(500).json({ error: 'Failed to cancel booking' });
        }
    }

    /**
     * GET /api/bookings
     * Get all bookings
     */
    async getAllBookings(req: Request, res: Response): Promise<void> {
        try {
            const bookings = bookingService.getAllBookings();

            // Sort by creation date (newest first)
            const sortedBookings = bookings.sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            );

            res.status(200).json(sortedBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({ error: 'Failed to fetch bookings' });
        }
    }

    /**
     * GET /api/bookings/:id
     * Get a specific booking by ID
     */
    async getBookingById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const booking = bookingService.getBookingById(id);

            if (!booking) {
                res.status(404).json({ error: `Booking with ID ${id} not found` });
                return;
            }

            res.status(200).json(booking);
        } catch (error) {
            console.error('Error fetching booking:', error);
            res.status(500).json({ error: 'Failed to fetch booking' });
        }
    }

    /**
     * GET /api/bookings/room/:roomId
     * Get all bookings for a specific room
     */
    async getBookingsByRoom(req: Request, res: Response): Promise<void> {
        try {
            const { roomId } = req.params;
            const bookings = bookingService.getBookingsByRoom(roomId);

            res.status(200).json(bookings);
        } catch (error) {
            console.error('Error fetching room bookings:', error);
            res.status(500).json({ error: 'Failed to fetch room bookings' });
        }
    }
}

export const bookingController = new BookingController();