import { Request, Response } from 'express';
import { roomService } from '../services/roomService';

/**
 * Room Controller - Handles HTTP requests for room endpoints
 */
export class RoomController {
    /**
     * GET /api/rooms
     * Get all rooms
     */
    async getAllRooms(req: Request, res: Response): Promise<void> {
        try {
            const rooms = roomService.getAllRooms();
            res.status(200).json(rooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            res.status(500).json({
                error: 'Failed to fetch rooms'
            });
        }
    }

    /**
     * GET /api/rooms/:id
     * Get a specific room by ID
     */
    async getRoomById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const room = roomService.getRoomById(id);

            if (!room) {
                res.status(404).json({
                    error: `Room with ID ${id} not found`
                });
                return;
            }

            res.status(200).json(room);
        } catch (error) {
            console.error('Error fetching room:', error);
            res.status(500).json({
                error: 'Failed to fetch room'
            });
        }
    }

    /**
     * GET /api/rooms/:id/stats
     * Get room statistics
     */
    async getRoomStats(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const stats = roomService.getRoomStats(id);
            res.status(200).json(stats);
        } catch (error: any) {
            console.error('Error fetching room stats:', error);

            if (error.message.includes('not found')) {
                res.status(404).json({ error: error.message });
                return;
            }

            res.status(500).json({
                error: 'Failed to fetch room statistics'
            });
        }
    }
}

export const roomController = new RoomController();