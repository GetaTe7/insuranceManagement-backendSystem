import app from './src/app.js';
import { config } from './src/config/env.js';
import connectDB from './src/config/db.js';
import logger from './src/config/logger.js';

// Connect to database
connectDB();

const PORT = config.port;

const server = app.listen(PORT, () => {
    logger.info(
        `Server running in ${config.env} mode on port ${PORT}`
    );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    logger.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
