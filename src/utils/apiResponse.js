/**
 * @desc    Send any success response
 * @param   {object} res Express response object
 * @param   {string} message Response message
 * @param   {object | array} [data=null] Response data
 * @param   {number} [statusCode=200] HTTP status code
 */
export const successResponse = (res, message, data = null, statusCode = 200) => {
    const response = {
        success: true,
        message,
    };
    if (data !== null && data !== undefined) {
        response.data = data;
    }
    return res.status(statusCode).json(response);
};

/**
 * @desc    Send any error response
 * @param   {object} res Express response object
 * @param   {string} message Response message
 * @param   {number} [statusCode=500] HTTP status code
 * @param   {object|string} [error=null] Detailed error object or string
 */
export const errorResponse = (res, message, statusCode = 500, error = null) => {
    const response = {
        success: false,
        message,
    };
    if (error !== null && error !== undefined) {
        response.error = error;
    }
    return res.status(statusCode).json(response);
};
