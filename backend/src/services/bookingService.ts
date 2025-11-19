import { Booking, BookingStatus, CreateBookingRequest, CreateBookingResponse } from '../types';
import { db } from '../models/database';
import { roomService } from './roomService';
import { pricingService } from './pricingService';
import { validationService } from './validationService';
import { generateId, parseDate } from '../utils/helpers';

/**
 * Booking Service - Handles booking business logic
 */
export class BookingService {
    /**
     * Create a new booking
     */
    async createBooking(request: CreateBookingRequest): Promise<CreateBookingResponse> {
        // Validate input
        const inputValidation = validationService.validateBookingInput(request);
        if (!inputValidation.valid) {
            throw new Error(inputValidation.errors.join(', '));
        }

        // Parse dates
        let startTime: Date;
        let endTime: Date;

        try {
            startTime = parseDate(request.startTime);
            endTime = parseDate(request.endTime);
        } catch (error: any) {
            throw new Error(`Invalid date format: ${error.message}`);
        }

        // Validate booking times
        const timeValidation = validationService.validateBookingTimes(startTime, endTime);
        if (!timeValidation.valid) {
            throw new Error(timeValidation.error!);
        }

        // Check if room exists
        const room = roomService.getRoomById(request.roomId);
        if (!room) {
            throw new Error(`Room with ID ${request.roomId} not found`);
        }

        // Check for conflicts
        const existingBookings = db.getAllBookings();
        const conflictCheck = validationService.checkForConflicts(
            request.roomId,
            startTime,
            endTime,
            existingBookings
        );

        if (conflictCheck.hasConflict) {
            throw new Error(conflictCheck.error!);
        }

        // Calculate pricing
        const pricing = pricingService.calculateBookingPrice(
            startTime,
            endTime,
            room.baseHourlyRate
        );

        // Create booking
        const booking: Booking = {
            id: generateId('b'),
            roomId: request.roomId,
            userName: request.userName.trim(),
            startTime,
            endTime,
            totalPrice: pricing.totalPrice,
            status: BookingStatus.CONFIRMED,
            createdAt: new Date()
        };

        // Save to database
        db.addBooking(booking);

        // Return response
        const response: CreateBookingResponse = {
            bookingId: booking.id,
            roomId: booking.roomId,
            userName: booking.userName,
            totalPrice: booking.totalPrice,
            status: booking.status
        };

        return response;
    }

    /**
     * Cancel a booking
     */
    async cancelBooking(bookingId: string): Promise<Booking> {
        // Get booking
        const booking = db.getBooking(bookingId);
        if (!booking) {
            throw new Error(`Booking with ID ${bookingId} not found`);
        }

        // Validate cancellation
        const cancellationValidation = validationService.validateCancellation(booking);
        if (!cancellationValidation.valid) {
            throw new Error(cancellationValidation.error!);
        }

        // Update booking status
        const updatedBooking = db.updateBooking(bookingId, {
            status: BookingStatus.CANCELLED
        });

        if (!updatedBooking) {
            throw new Error('Failed to cancel booking');
        }

        return updatedBooking;
    }

    /**
     * Get all bookings
     */
    getAllBookings(): Booking[] {
        return db.getAllBookings();
    }

    /**
     * Get booking by ID
     */
    getBookingById(bookingId: string): Booking | null {
        const booking = db.getBooking(bookingId);
        return booking || null;
    }

    /**
     * Get bookings by room
     */
    getBookingsByRoom(roomId: string): Booking[] {
        return db.getBookingsByRoom(roomId);
    }

    /**
     * Get bookings by date range
     */
    getBookingsByDateRange(startDate: Date, endDate: Date): Booking[] {
        return db.getBookingsByDateRange(startDate, endDate);
    }
}

export const bookingService = new BookingService();