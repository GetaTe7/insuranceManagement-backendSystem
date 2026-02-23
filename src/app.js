import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { successResponse } from './utils/apiResponse.js';
import errorHandler from './middlewares/error.middleware.js';
import routes from './routes.js';

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check
app.get('/api/v1/health', (req, res) => {
    successResponse(res, 'API is running', {
        uptime: process.uptime(),
        timestamp: Date.now(),
    });
});

// Mount routes
app.use('/api/v1', routes);

// Error handling middleware
app.use(errorHandler);

export default app;
