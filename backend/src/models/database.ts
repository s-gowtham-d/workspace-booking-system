import { Room, Booking } from '../types';

/**
 * In-memory database store
 * In production, this would be replaced with a real database (PostgreSQL, MongoDB, etc.)
 */
class Database {
    private rooms: Map<string, Room> = new Map();
    private bookings: Map<string, Booking> = new Map();

    // Room operations
    addRoom(room: Room): void {
        this.rooms.set(room.id, room);
    }

    getRoom(id: string): Room | undefined {
        return this.rooms.get(id);
    }

    getAllRooms(): Room[] {
        return Array.from(this.rooms.values());
    }

    roomExists(id: string): boolean {
        return this.rooms.has(id);
    }

    // Booking operations
    addBooking(booking: Booking): void {
        this.bookings.set(booking.id, booking);
    }

    getBooking(id: string): Booking | undefined {
        return this.bookings.get(id);
    }

    getAllBookings(): Booking[] {
        return Array.from(this.bookings.values());
    }

    updateBooking(id: string, updates: Partial<Booking>): Booking | undefined {
        const booking = this.bookings.get(id);
        if (!booking) return undefined;

        const updatedBooking = { ...booking, ...updates };
        this.bookings.set(id, updatedBooking);
        return updatedBooking;
    }

    // Query bookings by room
    getBookingsByRoom(roomId: string): Booking[] {
        return this.getAllBookings().filter(booking => booking.roomId === roomId);
    }

    // Query bookings by date range
    getBookingsByDateRange(startDate: Date, endDate: Date): Booking[] {
        return this.getAllBookings().filter(booking => {
            return booking.startTime >= startDate && booking.startTime <= endDate;
        });
    }

    // Clear all data (useful for testing)
    clear(): void {
        this.rooms.clear();
        this.bookings.clear();
    }

    // Get database stats
    getStats() {
        return {
            totalRooms: this.rooms.size,
            totalBookings: this.bookings.size,
            confirmedBookings: this.getAllBookings().filter(b => b.status === 'CONFIRMED').length,
            cancelledBookings: this.getAllBookings().filter(b => b.status === 'CANCELLED').length
        };
    }
}

// Export singleton instance
export const db = new Database();