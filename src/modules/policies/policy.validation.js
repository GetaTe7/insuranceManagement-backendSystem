import Joi from 'joi';

export const createPolicySchema = Joi.object({
    policyNumber: Joi.string().required().messages({
        'any.required': 'Policy number is required',
    }),
    policyHolder: Joi.string().required().messages({
        'any.required': 'Policy holder ID is required',
    }),
    type: Joi.string()
        .valid('Life', 'Health', 'Vehicle', 'Property', 'Travel')
        .required(),
    premiumAmount: Joi.number().min(0).required().messages({
        'number.min': 'Premium amount cannot be negative',
        'any.required': 'Premium amount is required',
    }),
    coverageAmount: Joi.number().min(0).required().messages({
        'number.min': 'Coverage amount cannot be negative',
        'any.required': 'Coverage amount is required',
    }),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required().messages({
        'date.greater': 'End date must be after start date',
    }),
});

export const updatePolicySchema = Joi.object({
    type: Joi.string().valid('Life', 'Health', 'Vehicle', 'Property', 'Travel'),
    premiumAmount: Joi.number().min(0),
    coverageAmount: Joi.number().min(0),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    status: Joi.string().valid('active', 'expired', 'cancelled'),
});
