import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    timezone: process.env.TIMEZONE || 'Asia/Kolkata',

    // Peak hours configuration (in 24-hour format)
    peakHours: {
        morning: { start: 10, end: 13 }, // 10 AM - 1 PM
        evening: { start: 16, end: 19 }, // 4 PM - 7 PM
        peakMultiplier: 1.5,
        weekdays: [1, 2, 3, 4, 5] // Monday to Friday
    },

    // Booking rules
    booking: {
        maxDurationHours: 12,
        minCancellationHours: 2
    }
};