import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { successResponse } from './utils/apiResponse.js';
import errorHandler from './middlewares/error.middleware.js';
import routes from './routes.js';

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS (Allow specific origins in production, fallback to all)
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set security HTTP headers
app.use(helmet());

// API Documentation (Mount before sanitization to avoid request mutation conflicts)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Apply rate limiting (e.g., max 100 requests per 10 mins per IP)
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
    message: 'Too many requests from this IP, please try again after 10 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/v1', limiter); // Only apply to actual API endpoints

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS (Disable in test environment)
if (process.env.NODE_ENV !== 'test') {
    app.use(xss());
}

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
