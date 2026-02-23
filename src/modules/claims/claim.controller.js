import {
    createClaimService,
    getClaimsService,
    getClaimByIdService,
    updateClaimStatusService,
} from './claim.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

/**
 * @desc    Create new claim
 * @route   POST /api/v1/claims
 * @access  Private
 */
export const createClaim = async (req, res, next) => {
    try {
        const claim = await createClaimService(req.body, req.user.id);
        successResponse(res, 'Claim created successfully', claim, 201);
    } catch (error) {
        if (error.message.includes('Policy') || error.message.includes('Claim amount') || error.message.includes('pending claim')) {
            return errorResponse(res, error.message, 400);
        }
        next(error);
    }
};

/**
 * @desc    Get all claims
 * @route   GET /api/v1/claims
 * @access  Private
 */
export const getClaims = async (req, res, next) => {
    try {
        const claims = await getClaimsService(req.query);
        successResponse(res, 'Claims retrieved successfully', claims);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get claim by ID
 * @route   GET /api/v1/claims/:id
 * @access  Private
 */
export const getClaimById = async (req, res, next) => {
    try {
        const claim = await getClaimByIdService(req.params.id);
        if (!claim) {
            return errorResponse(res, 'Claim not found', 404);
        }
        successResponse(res, 'Claim retrieved successfully', claim);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Approve/Reject Claim
 * @route   PATCH /api/v1/claims/:id/status
 * @access  Private (Admin)
 */
export const updateClaimStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const claim = await updateClaimStatusService(req.params.id, status);
        if (!claim) {
            return errorResponse(res, 'Claim not found', 404);
        }
        successResponse(res, `Claim ${status} successfully`, claim);
    } catch (error) {
        next(error);
    }
};
