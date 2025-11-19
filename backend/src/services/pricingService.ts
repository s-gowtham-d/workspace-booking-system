import { config } from '../config';

/**
 * Pricing Service - Handles dynamic pricing calculations
 * 
 * Peak Hours: 10 AM - 1 PM & 4 PM - 7 PM (Mon-Fri)
 * Peak Rate: baseRate × 1.5
 * Off-Peak Rate: baseRate
 */
export class PricingService {
    /**
     * Check if a given hour is a peak hour
     */
    private isPeakHour(date: Date): boolean {
        const hour = date.getHours();
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Check if it's a weekday (Monday-Friday)
        if (!config.peakHours.weekdays.includes(dayOfWeek)) {
            return false;
        }

        // Check if hour falls in morning peak (10 AM - 1 PM)
        const isMorningPeak =
            hour >= config.peakHours.morning.start &&
            hour < config.peakHours.morning.end;

        // Check if hour falls in evening peak (4 PM - 7 PM)
        const isEveningPeak =
            hour >= config.peakHours.evening.start &&
            hour < config.peakHours.evening.end;

        return isMorningPeak || isEveningPeak;
    }

    /**
     * Generate hourly slots between start and end time
     */
    private generateHourlySlots(startTime: Date, endTime: Date): Date[] {
        const slots: Date[] = [];
        const current = new Date(startTime);

        while (current < endTime) {
            slots.push(new Date(current));
            current.setHours(current.getHours() + 1);
        }

        return slots;
    }

    /**
     * Calculate price for a single hour slot
     */
    private calculateSlotPrice(slotStart: Date, baseRate: number): number {
        const isPeak = this.isPeakHour(slotStart);
        const rate = isPeak ? baseRate * config.peakHours.peakMultiplier : baseRate;
        return rate;
    }

    /**
     * Calculate total price for a booking
     * 
     * @param startTime - Booking start time
     * @param endTime - Booking end time
     * @param baseHourlyRate - Room's base hourly rate
     * @returns Total price and breakdown
     */
    calculateBookingPrice(
        startTime: Date,
        endTime: Date,
        baseHourlyRate: number
    ): {
        totalPrice: number;
        breakdown: Array<{ hour: string; rate: number; isPeak: boolean }>
    } {
        const slots = this.generateHourlySlots(startTime, endTime);
        let totalPrice = 0;
        const breakdown: Array<{ hour: string; rate: number; isPeak: boolean }> = [];

        for (const slot of slots) {
            const slotEnd = new Date(slot);
            slotEnd.setHours(slotEnd.getHours() + 1);

            // Calculate duration for this slot (handles partial hours at the end)
            const slotEndTime = slotEnd > endTime ? endTime : slotEnd;
            const durationMs = slotEndTime.getTime() - slot.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);

            const isPeak = this.isPeakHour(slot);
            const hourlyRate = isPeak ? baseHourlyRate * config.peakHours.peakMultiplier : baseHourlyRate;
            const slotPrice = hourlyRate * durationHours;

            totalPrice += slotPrice;

            breakdown.push({
                hour: slot.toISOString(),
                rate: hourlyRate,
                isPeak
            });
        }

        return {
            totalPrice: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
            breakdown
        };
    }

    /**
     * Get pricing information for display
     */
    getPricingInfo(baseHourlyRate: number) {
        const peakRate = baseHourlyRate * config.peakHours.peakMultiplier;

        return {
            baseRate: baseHourlyRate,
            peakRate,
            peakHours: {
                morning: `${config.peakHours.morning.start}:00 - ${config.peakHours.morning.end}:00`,
                evening: `${config.peakHours.evening.start}:00 - ${config.peakHours.evening.end}:00`,
                days: 'Monday - Friday'
            }
        };
    }
}

export const pricingService = new PricingService();