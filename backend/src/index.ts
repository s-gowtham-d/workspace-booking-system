import app from './app';
import { config } from './config';

const startServer = () => {
    try {
        const port = config.port;

        app.listen(port, () => {
            console.log('🚀 Server started successfully');
            console.log(`📍 Environment: ${config.nodeEnv}`);
            console.log(`🌐 Server running on port ${port}`);

            if (config.nodeEnv === 'development') {
                console.log(`🔗 API URL: http://localhost:${port}/api`);
                console.log(`💚 Health check: http://localhost:${port}/health`);
            } else {
                console.log(`✅ Production mode - Ready to handle requests`);
            }
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received, shutting down gracefully');
    process.exit(0);
});

startServer();