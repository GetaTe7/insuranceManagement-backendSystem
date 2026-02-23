import { registerUser, loginUser } from './auth.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const { user, token } = await registerUser(req.body);
        successResponse(res, 'User registered successfully', { user, token }, 201);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await loginUser(email, password);
        successResponse(res, 'User logged in successfully', { user, token });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        successResponse(res, 'User data retrieved', user);
    } catch (error) {
        next(error);
    }
};
