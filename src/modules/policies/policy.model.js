import mongoose from 'mongoose';

const PolicySchema = new mongoose.Schema(
    {
        policyNumber: {
            type: String,
            required: [true, 'Please add a policy number'],
            unique: true,
            trim: true,
        },
        policyHolder: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Please add a policy holder'],
        },
        type: {
            type: String,
            required: [true, 'Please add a policy type'],
            enum: ['Life', 'Health', 'Vehicle', 'Property', 'Travel'],
        },
        premiumAmount: {
            type: Number,
            required: [true, 'Please add a premium amount'],
            min: [0, 'Premium amount cannot be negative'],
        },
        coverageAmount: {
            type: Number,
            required: [true, 'Please add a coverage amount'],
            min: [0, 'Coverage amount cannot be negative'],
        },
        startDate: {
            type: Date,
            required: [true, 'Please add a start date'],
        },
        endDate: {
            type: Date,
            required: [true, 'Please add an end date'],
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled'],
            default: 'active',
        },
        agent: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Please add an agent'],
        },
    },
    {
        timestamps: true,
    }
);

// Add validation to ensure endDate is after startDate
PolicySchema.pre('save', function (next) {
    if (this.startDate >= this.endDate) {
        next(new Error('End date must be after start date'));
    }
    next();
});

export default mongoose.model('Policy', PolicySchema);
