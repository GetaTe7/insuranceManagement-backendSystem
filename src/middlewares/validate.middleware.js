import { errorResponse } from '../utils/apiResponse.js';

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, {
        abortEarly: false,
        errors: {
            wrap: {
                label: '',
            },
        },
    });

    if (error) {
        const errorMessage = error.details
            .map((detail) => detail.message)
            .join(', ');
        return errorResponse(res, errorMessage, 400);
    }

    next();
};

export default validate;
