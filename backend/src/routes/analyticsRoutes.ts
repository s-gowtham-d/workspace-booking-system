import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';

const router = Router();

/**
 * Analytics Routes
 */

// GET /api/analytics - Get analytics for all rooms
router.get('/', (req, res) => analyticsController.getAnalytics(req, res));

// GET /api/analytics/overview - Get overall statistics
router.get('/overview', (req, res) => analyticsController.getOverallStats(req, res));

// GET /api/analytics/utilization - Get utilization metrics
router.get('/utilization', (req, res) => analyticsController.getUtilizationMetrics(req, res));

// GET /api/analytics/room/:roomId - Get analytics for specific room
router.get('/room/:roomId', (req, res) => analyticsController.getRoomAnalytics(req, res));

export default router;