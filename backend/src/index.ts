import app from './app';
import { config } from './config';

const startServer = () => {
    try {
        app.listen(config.port, () => {
            console.log('🚀 Server started successfully');
            console.log(`📍 Environment: ${config.nodeEnv}`);
            console.log(`🌐 Server running on port ${config.port}`);
            console.log(`🔗 API URL: http://localhost:${config.port}/api`);
            console.log(`💚 Health check: http://localhost:${config.port}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();