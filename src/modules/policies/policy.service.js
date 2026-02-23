import Policy from './policy.model.js';

/**
 * @desc Create new policy
 */
export const createPolicyService = async (policyData, agentId) => {
    const policy = await Policy.create({
        ...policyData,
        agent: agentId,
    });
    return policy;
};

/**
 * @desc Get all policies
 */
export const getPoliciesService = async (query = {}) => {
    const policies = await Policy.find(query).populate('policyHolder agent', 'name email');
    return policies;
};

/**
 * @desc Get policy by ID
 */
export const getPolicyByIdService = async (id) => {
    const policy = await Policy.findById(id).populate('policyHolder agent', 'name email');
    return policy;
};

/**
 * @desc Update policy
 */
export const updatePolicyService = async (id, updateData) => {
    const policy = await Policy.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    return policy;
};

/**
 * @desc Cancel policy
 */
export const cancelPolicyService = async (id) => {
    const policy = await Policy.findByIdAndUpdate(
        id,
        { status: 'cancelled' },
        { new: true }
    );
    return policy;
};
