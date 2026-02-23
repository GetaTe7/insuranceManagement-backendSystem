import {
    createPolicyService,
    getPoliciesService,
    getPolicyByIdService,
    updatePolicyService,
    cancelPolicyService,
} from './policy.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

/**
 * @desc    Create new policy
 * @route   POST /api/v1/policies
 * @access  Private (Admin/Agent)
 */
export const createPolicy = async (req, res, next) => {
    try {
        const policy = await createPolicyService(req.body, req.user.id);
        successResponse(res, 'Policy created successfully', policy, 201);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all policies
 * @route   GET /api/v1/policies
 * @access  Private
 */
export const getPolicies = async (req, res, next) => {
    try {
        const policies = await getPoliciesService(req.query);
        successResponse(res, 'Policies retrieved successfully', policies);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get policy by ID
 * @route   GET /api/v1/policies/:id
 * @access  Private
 */
export const getPolicyById = async (req, res, next) => {
    try {
        const policy = await getPolicyByIdService(req.params.id);
        if (!policy) {
            return errorResponse(res, 'Policy not found', 404);
        }
        successResponse(res, 'Policy retrieved successfully', policy);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update policy
 * @route   PUT /api/v1/policies/:id
 * @access  Private (Admin/Agent)
 */
export const updatePolicy = async (req, res, next) => {
    try {
        const policy = await updatePolicyService(req.params.id, req.body);
        if (!policy) {
            return errorResponse(res, 'Policy not found', 404);
        }
        successResponse(res, 'Policy updated successfully', policy);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Cancel policy
 * @route   PATCH /api/v1/policies/:id/cancel
 * @access  Private (Admin/Agent)
 */
export const cancelPolicy = async (req, res, next) => {
    try {
        const policy = await cancelPolicyService(req.params.id);
        if (!policy) {
            return errorResponse(res, 'Policy not found', 404);
        }
        successResponse(res, 'Policy cancelled successfully', policy);
    } catch (error) {
        next(error);
    }
};
