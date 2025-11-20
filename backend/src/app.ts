import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import { initializeDatabase } from './models/seedData';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import roomRoutes from './routes/roomRoutes';
import bookingRoutes from './routes/bookingRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import testRoutes from './routes/testRoutes';

const app: Application = express();

// Initialize database with seed data
initializeDatabase();

// Middleware
app.use(cors({
    origin: config.frontendUrl,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv
    });
});

// API routes
app.get('/api', (req: Request, res: Response) => {
    res.json({
        message: 'Workspace Booking API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            rooms: '/api/rooms',
            bookings: '/api/bookings',
            analytics: '/api/analytics'
        }
    });
});

// Mount routes
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);

// Test routes (remove in production)
if (config.nodeEnv === 'development') {
    app.use('/api/test', testRoutes);
}

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;