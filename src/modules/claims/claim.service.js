import Claim from './claim.model.js';
import Policy from '../policies/policy.model.js';

/**
 * @desc Create new claim
 */
export const createClaimService = async (claimData, userId) => {
    const { policy: policyId, claimAmount } = claimData;

    // Rule 1: Policy must exist
    const policy = await Policy.findById(policyId);
    if (!policy) {
        throw new Error('Policy not found');
    }

    // Rule 2: Policy must be active
    if (policy.status !== 'active') {
        throw new Error('Cannot file a claim on an inactive or expired policy');
    }

    // Rule 3: Claim amount <= coverage amount
    if (claimAmount > policy.coverageAmount) {
        throw new Error('Claim amount exceeds policy coverage amount');
    }

    // Rule 4: Prevent duplicate claims (simplified: prevent multiple pending claims for same policy)
    const existingPendingClaim = await Claim.findOne({
        policy: policyId,
        status: 'pending',
    });
    if (existingPendingClaim) {
        throw new Error('A pending claim already exists for this policy');
    }

    // Generate a rudimentary claim number if not provided (for demonstration)
    if (!claimData.claimNumber) {
        claimData.claimNumber = `CLM-${Date.now()}`;
    }

    const claim = await Claim.create({
        ...claimData,
        claimedBy: userId,
    });

    return claim;
};

/**
 * @desc Get all claims
 */
export const getClaimsService = async (query = {}) => {
    const claims = await Claim.find(query).populate('policy claimedBy', 'policyNumber type name email');
    return claims;
};

/**
 * @desc Get claim by ID
 */
export const getClaimByIdService = async (id) => {
    const claim = await Claim.findById(id).populate('policy claimedBy');
    return claim;
};

/**
 * @desc Update claim status (Approve/Reject)
 */
export const updateClaimStatusService = async (id, status) => {
    const claim = await Claim.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );
    return claim;
};
