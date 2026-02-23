import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { errorResponse } from '../utils/apiResponse.js';
import User from '../modules/auth/auth.model.js';

/**
 * @desc    Protect routes - Verify JWT token
 */
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return errorResponse(res, 'Not authorized to access this route', 401);
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return errorResponse(res, 'User not found', 404);
        }

        next();
    } catch (err) {
        return errorResponse(res, 'Not authorized to access this route', 401);
    }
};

export default protect;
