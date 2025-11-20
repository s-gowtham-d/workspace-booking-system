import { RoomAnalytics, BookingStatus } from '../types';
import { db } from '../models/database';
import { roomService } from './roomService';
import { calculateHours } from '../utils/helpers';

/**
 * Analytics Service - Handles analytics and reporting
 */
export class AnalyticsService {
    /**
     * Get analytics for all rooms within a date range
     * Only includes CONFIRMED bookings
     */
    getAnalytics(fromDate: Date, toDate: Date): RoomAnalytics[] {
        // Validate date range
        if (fromDate > toDate) {
            throw new Error('Start date must be before end date');
        }

        // Get all confirmed bookings in the date range
        const allBookings = db.getAllBookings();
        const relevantBookings = allBookings.filter(booking => {
            // Only include CONFIRMED bookings
            if (booking.status !== BookingStatus.CONFIRMED) {
                return false;
            }

            // Check if booking falls within the date range
            // Include bookings that start within the range
            return booking.startTime >= fromDate && booking.startTime <= toDate;
        });

        // Group bookings by room
        const roomBookingsMap = new Map<string, typeof relevantBookings>();

        relevantBookings.forEach(booking => {
            if (!roomBookingsMap.has(booking.roomId)) {
                roomBookingsMap.set(booking.roomId, []);
            }
            roomBookingsMap.get(booking.roomId)!.push(booking);
        });

        // Calculate analytics for each room
        const analytics: RoomAnalytics[] = [];
        const allRooms = roomService.getAllRooms();

        allRooms.forEach(room => {
            const roomBookings = roomBookingsMap.get(room.id) || [];

            // Calculate total hours and revenue
            let totalHours = 0;
            let totalRevenue = 0;

            roomBookings.forEach(booking => {
                const hours = calculateHours(booking.startTime, booking.endTime);
                totalHours += hours;
                totalRevenue += booking.totalPrice;
            });

            // Only include rooms that have bookings in the date range
            // Or include all rooms with zero values (based on requirement)
            analytics.push({
                roomId: room.id,
                roomName: room.name,
                totalHours: Math.round(totalHours * 100) / 100, // Round to 2 decimal places
                totalRevenue: Math.round(totalRevenue * 100) / 100
            });
        });

        // Sort by revenue (highest first)
        analytics.sort((a, b) => b.totalRevenue - a.totalRevenue);

        return analytics;
    }

    /**
     * Get analytics for a specific room
     */
    getRoomAnalytics(roomId: string, fromDate: Date, toDate: Date): RoomAnalytics {
        const room = roomService.getRoomById(roomId);
        if (!room) {
            throw new Error(`Room with ID ${roomId} not found`);
        }

        const allAnalytics = this.getAnalytics(fromDate, toDate);
        const roomAnalytics = allAnalytics.find(a => a.roomId === roomId);

        if (!roomAnalytics) {
            // Return zero values if no bookings found
            return {
                roomId: room.id,
                roomName: room.name,
                totalHours: 0,
                totalRevenue: 0
            };
        }

        return roomAnalytics;
    }

    /**
     * Get overall statistics
     */
    getOverallStats(fromDate: Date, toDate: Date) {
        const analytics = this.getAnalytics(fromDate, toDate);

        const totalRevenue = analytics.reduce((sum, room) => sum + room.totalRevenue, 0);
        const totalHours = analytics.reduce((sum, room) => sum + room.totalHours, 0);
        const totalRooms = analytics.length;
        const activeRooms = analytics.filter(a => a.totalHours > 0).length;

        return {
            dateRange: {
                from: fromDate.toISOString(),
                to: toDate.toISOString()
            },
            summary: {
                totalRevenue: Math.round(totalRevenue * 100) / 100,
                totalHours: Math.round(totalHours * 100) / 100,
                totalRooms,
                activeRooms,
                averageRevenuePerRoom: totalRooms > 0
                    ? Math.round((totalRevenue / totalRooms) * 100) / 100
                    : 0
            },
            roomBreakdown: analytics
        };
    }

    /**
     * Get utilization metrics
     */
    getUtilizationMetrics(fromDate: Date, toDate: Date) {
        const allBookings = db.getAllBookings();

        const confirmedBookings = allBookings.filter(
            b => b.status === BookingStatus.CONFIRMED &&
                b.startTime >= fromDate &&
                b.startTime <= toDate
        );

        const cancelledBookings = allBookings.filter(
            b => b.status === BookingStatus.CANCELLED &&
                b.createdAt >= fromDate &&
                b.createdAt <= toDate
        );

        const totalBookings = confirmedBookings.length + cancelledBookings.length;
        const cancellationRate = totalBookings > 0
            ? Math.round((cancelledBookings.length / totalBookings) * 10000) / 100
            : 0;

        return {
            totalBookings,
            confirmedBookings: confirmedBookings.length,
            cancelledBookings: cancelledBookings.length,
            cancellationRate: `${cancellationRate}%`
        };
    }
}

export const analyticsService = new AnalyticsService();