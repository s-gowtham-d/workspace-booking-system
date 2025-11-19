import { config } from '../config';
import { calculateHours, doTimeRangesOverlap } from '../utils/helpers';
import { Booking, BookingStatus } from '../types';

/**
 * Validation Service - Handles booking validations
 */
export class ValidationService {
    /**
     * Validate booking time constraints
     */
    validateBookingTimes(startTime: Date, endTime: Date): { valid: boolean; error?: string } {
        const now = new Date();

        // Check if start time is in the past
        if (startTime < now) {
            return {
                valid: false,
                error: 'Start time cannot be in the past'
            };
        }

        // Check if start time is before end time
        if (startTime >= endTime) {
            return {
                valid: false,
                error: 'Start time must be before end time'
            };
        }

        // Check maximum duration (12 hours)
        const duration = calculateHours(startTime, endTime);
        if (duration > config.booking.maxDurationHours) {
            return {
                valid: false,
                error: `Booking duration cannot exceed ${config.booking.maxDurationHours} hours. Requested: ${duration.toFixed(2)} hours`
            };
        }

        return { valid: true };
    }

    /**
     * Check for booking conflicts
     * Returns the conflicting booking if found
     */
    checkForConflicts(
        roomId: string,
        startTime: Date,
        endTime: Date,
        existingBookings: Booking[],
        excludeBookingId?: string
    ): { hasConflict: boolean; conflictingBooking?: Booking; error?: string } {
        // Only check CONFIRMED bookings for the same room
        const relevantBookings = existingBookings.filter(booking =>
            booking.roomId === roomId &&
            booking.status === BookingStatus.CONFIRMED &&
            booking.id !== excludeBookingId // Exclude current booking if updating
        );

        for (const booking of relevantBookings) {
            const overlap = doTimeRangesOverlap(
                startTime,
                endTime,
                booking.startTime,
                booking.endTime
            );

            if (overlap) {
                const formatTime = (date: Date) => {
                    return date.toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    });
                };

                return {
                    hasConflict: true,
                    conflictingBooking: booking,
                    error: `Room already booked from ${formatTime(booking.startTime)} to ${formatTime(booking.endTime)}`
                };
            }
        }

        return { hasConflict: false };
    }

    /**
     * Validate cancellation eligibility
     */
    validateCancellation(booking: Booking): { valid: boolean; error?: string } {
        // Check if already cancelled
        if (booking.status === BookingStatus.CANCELLED) {
            return {
                valid: false,
                error: 'Booking is already cancelled'
            };
        }

        // Check if booking has already started or passed
        const now = new Date();
        if (booking.startTime <= now) {
            return {
                valid: false,
                error: 'Cannot cancel a booking that has already started or passed'
            };
        }

        // Check minimum cancellation time (2 hours before start)
        const hoursUntilStart = calculateHours(now, booking.startTime);
        if (hoursUntilStart < config.booking.minCancellationHours) {
            return {
                valid: false,
                error: `Cancellation must be made at least ${config.booking.minCancellationHours} hours before the booking start time. Time remaining: ${hoursUntilStart.toFixed(2)} hours`
            };
        }

        return { valid: true };
    }

    /**
     * Validate user input for booking creation
     */
    validateBookingInput(data: {
        roomId?: string;
        userName?: string;
        startTime?: string;
        endTime?: string;
    }): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!data.roomId || data.roomId.trim() === '') {
            errors.push('Room ID is required');
        }

        if (!data.userName || data.userName.trim() === '') {
            errors.push('User name is required');
        } else if (data.userName.trim().length < 2) {
            errors.push('User name must be at least 2 characters long');
        }

        if (!data.startTime) {
            errors.push('Start time is required');
        }

        if (!data.endTime) {
            errors.push('End time is required');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

export const validationService = new ValidationService();