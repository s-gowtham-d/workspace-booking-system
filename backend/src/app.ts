import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';

const app: Application = express();

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

// API routes will be added here
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

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: config.nodeEnv === 'development' ? err.message : undefined
    });
});

export default app;