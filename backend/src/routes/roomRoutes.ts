import { Router } from 'express';
import { roomController } from '../controllers/roomController';

const router = Router();

/**
 * Room Routes
 */

// GET /api/rooms - Get all rooms
router.get('/', (req, res) => roomController.getAllRooms(req, res));

// GET /api/rooms/:id - Get specific room
router.get('/:id', (req, res) => roomController.getRoomById(req, res));

// GET /api/rooms/:id/stats - Get room statistics
router.get('/:id/stats', (req, res) => roomController.getRoomStats(req, res));

export default router;