import { Router, Request, Response } from 'express';
import { pricingService } from '../services/pricingService';
import { parseDate } from '../utils/helpers';

const router = Router();

/**
 * Test Routes - For testing pricing logic
 * Remove in production
 */

// POST /api/test/calculate-price
router.post('/calculate-price', (req: Request, res: Response) => {
    try {
        const { startTime, endTime, baseRate } = req.body;

        if (!startTime || !endTime || !baseRate) {
            res.status(400).json({
                error: 'Missing required fields: startTime, endTime, baseRate'
            });
            return;
        }

        const start = parseDate(startTime);
        const end = parseDate(endTime);

        const result = pricingService.calculateBookingPrice(start, end, baseRate);

        res.json({
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            baseRate,
            ...result,
            summary: {
                totalHours: ((end.getTime() - start.getTime()) / (1000 * 60 * 60)).toFixed(2),
                peakHours: result.breakdown.filter(b => b.isPeak).length,
                offPeakHours: result.breakdown.filter(b => !b.isPeak).length
            }
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// GET /api/test/pricing-info
router.get('/pricing-info/:baseRate', (req: Request, res: Response) => {
    const baseRate = parseFloat(req.params.baseRate);

    if (isNaN(baseRate)) {
        res.status(400).json({ error: 'Invalid base rate' });
        return;
    }

    const info = pricingService.getPricingInfo(baseRate);
    res.json(info);
});

export default router;