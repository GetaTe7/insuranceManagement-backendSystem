/**
 * @desc    Send any success response
 * @param   {string} message
 * @param   {object | array} data
 * @param   {number} statusCode
 */
export const successResponse = (res, message, data, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

/**
 * @desc    Send any error response
 * @param   {string} message
 * @param   {number} statusCode
 */
export const errorResponse = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
