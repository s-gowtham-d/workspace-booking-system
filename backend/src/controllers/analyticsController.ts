import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';
import { parseDate } from '../utils/helpers';

/**
 * Analytics Controller - Handles HTTP requests for analytics endpoints
 */
export class AnalyticsController {
    /**
     * GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD
     * Get analytics for all rooms within date range
     */
    async getAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const { from, to } = req.query;

            // Validate required parameters
            if (!from || !to) {
                res.status(400).json({
                    error: 'Missing required query parameters: from and to dates',
                    example: '/api/analytics?from=2025-11-20&to=2025-11-25'
                });
                return;
            }

            // Parse dates
            let fromDate: Date;
            let toDate: Date;

            try {
                // Parse date strings (YYYY-MM-DD format)
                fromDate = new Date(from as string);
                toDate = new Date(to as string);

                // Set time to start and end of day for inclusive range
                fromDate.setHours(0, 0, 0, 0);
                toDate.setHours(23, 59, 59, 999);

                // Validate dates
                if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
                    throw new Error('Invalid date format');
                }
            } catch (error) {
                res.status(400).json({
                    error: 'Invalid date format. Use YYYY-MM-DD format',
                    example: 'from=2025-11-20&to=2025-11-25'
                });
                return;
            }

            const analytics = analyticsService.getAnalytics(fromDate, toDate);

            res.status(200).json(analytics);
        } catch (error: any) {
            console.error('Error fetching analytics:', error);

            if (error.message.includes('before')) {
                res.status(400).json({ error: error.message });
                return;
            }

            res.status(500).json({ error: 'Failed to fetch analytics' });
        }
    }

    /**
     * GET /api/analytics/room/:roomId?from=YYYY-MM-DD&to=YYYY-MM-DD
     * Get analytics for a specific room
     */
    async getRoomAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const { roomId } = req.params;
            const { from, to } = req.query;

            if (!from || !to) {
                res.status(400).json({
                    error: 'Missing required query parameters: from and to dates'
                });
                return;
            }

            const fromDate = new Date(from as string);
            const toDate = new Date(to as string);

            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(23, 59, 59, 999);

            const analytics = analyticsService.getRoomAnalytics(roomId, fromDate, toDate);

            res.status(200).json(analytics);
        } catch (error: any) {
            console.error('Error fetching room analytics:', error);

            if (error.message.includes('not found')) {
                res.status(404).json({ error: error.message });
                return;
            }

            res.status(500).json({ error: 'Failed to fetch room analytics' });
        }
    }

    /**
     * GET /api/analytics/overview?from=YYYY-MM-DD&to=YYYY-MM-DD
     * Get overall statistics and summary
     */
    async getOverallStats(req: Request, res: Response): Promise<void> {
        try {
            const { from, to } = req.query;

            if (!from || !to) {
                res.status(400).json({
                    error: 'Missing required query parameters: from and to dates'
                });
                return;
            }

            const fromDate = new Date(from as string);
            const toDate = new Date(to as string);

            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(23, 59, 59, 999);

            const stats = analyticsService.getOverallStats(fromDate, toDate);

            res.status(200).json(stats);
        } catch (error: any) {
            console.error('Error fetching overall stats:', error);
            res.status(500).json({ error: 'Failed to fetch statistics' });
        }
    }

    /**
     * GET /api/analytics/utilization?from=YYYY-MM-DD&to=YYYY-MM-DD
     * Get utilization metrics
     */
    async getUtilizationMetrics(req: Request, res: Response): Promise<void> {
        try {
            const { from, to } = req.query;

            if (!from || !to) {
                res.status(400).json({
                    error: 'Missing required query parameters: from and to dates'
                });
                return;
            }

            const fromDate = new Date(from as string);
            const toDate = new Date(to as string);

            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(23, 59, 59, 999);

            const metrics = analyticsService.getUtilizationMetrics(fromDate, toDate);

            res.status(200).json(metrics);
        } catch (error: any) {
            console.error('Error fetching utilization metrics:', error);
            res.status(500).json({ error: 'Failed to fetch metrics' });
        }
    }
}

export const analyticsController = new AnalyticsController();