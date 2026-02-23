import Joi from 'joi';

export const createClaimSchema = Joi.object({
    claimNumber: Joi.string().trim(),
    policy: Joi.string().required().messages({
        'any.required': 'Policy ID is required',
    }),
    claimAmount: Joi.number().min(0).required().messages({
        'number.min': 'Claim amount cannot be negative',
        'any.required': 'Claim amount is required',
    }),
    reason: Joi.string().required().messages({
        'any.required': 'Reason for the claim is required',
    }),
});

export const updateClaimStatusSchema = Joi.object({
    status: Joi.string().valid('approved', 'rejected').required().messages({
        'any.only': 'Status must be either approved or rejected',
        'any.required': 'Status is required',
    }),
});
