import logger from '../config/logger.js';
import { errorResponse } from '../utils/apiResponse.js';

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log for developer
    logger.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found`;
        return errorResponse(res, message, 404, err);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        return errorResponse(res, message, 400, err);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ');
        return errorResponse(res, message, 400, err);
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Server Error';
    const errDetail = process.env.NODE_ENV === 'development' ? err.stack : undefined;

    return errorResponse(res, message, statusCode, errDetail);
};

export default errorHandler;
