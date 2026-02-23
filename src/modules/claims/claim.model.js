import mongoose from 'mongoose';

const ClaimSchema = new mongoose.Schema(
    {
        claimNumber: {
            type: String,
            required: [true, 'Please add a claim number'],
            unique: true,
            trim: true,
        },
        policy: {
            type: mongoose.Schema.ObjectId,
            ref: 'Policy',
            required: [true, 'Please add a policy ID'],
        },
        claimAmount: {
            type: Number,
            required: [true, 'Please add a claim amount'],
            min: [0, 'Claim amount cannot be negative'],
        },
        reason: {
            type: String,
            required: [true, 'Please add a reason for the claim'],
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        claimedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Claim', ClaimSchema);
