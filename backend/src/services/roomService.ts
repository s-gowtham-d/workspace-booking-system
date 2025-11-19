import { Room } from '../types';
import { db } from '../models/database';

/**
 * Room Service - Handles room-related business logic
 */
export class RoomService {
    /**
     * Get all available rooms
     */
    getAllRooms(): Room[] {
        return db.getAllRooms();
    }

    /**
     * Get a specific room by ID
     */
    getRoomById(roomId: string): Room | null {
        const room = db.getRoom(roomId);
        return room || null;
    }

    /**
     * Check if a room exists
     */
    roomExists(roomId: string): boolean {
        return db.roomExists(roomId);
    }

    /**
     * Add a new room (for admin purposes)
     */
    addRoom(room: Room): Room {
        // Validate room data
        if (!room.id || !room.name || room.baseHourlyRate <= 0 || room.capacity <= 0) {
            throw new Error('Invalid room data');
        }

        // Check if room already exists
        if (db.roomExists(room.id)) {
            throw new Error(`Room with ID ${room.id} already exists`);
        }

        db.addRoom(room);
        return room;
    }

    /**
     * Get room statistics
     */
    getRoomStats(roomId: string) {
        const room = this.getRoomById(roomId);
        if (!room) {
            throw new Error(`Room ${roomId} not found`);
        }

        const bookings = db.getBookingsByRoom(roomId);
        const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');

        return {
            roomId: room.id,
            roomName: room.name,
            totalBookings: bookings.length,
            confirmedBookings: confirmedBookings.length,
            cancelledBookings: bookings.length - confirmedBookings.length
        };
    }
}

export const roomService = new RoomService();