import User from './auth.model.js';

/**
 * @desc Register user service
 */
export const registerUser = async (userData) => {
    const user = await User.create(userData);
    const token = user.getSignedJwtToken();
    return { user, token };
};

/**
 * @desc Login user service
 */
export const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = user.getSignedJwtToken();
    return { user, token };
};
