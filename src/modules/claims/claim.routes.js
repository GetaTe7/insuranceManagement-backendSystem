import express from 'express';
import {
    createClaim,
    getClaims,
    getClaimById,
    updateClaimStatus,
} from './claim.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import protect from '../../middlewares/auth.middleware.js';
import authorize from '../../middlewares/role.middleware.js';
import {
    createClaimSchema,
    updateClaimStatusSchema,
} from './claim.validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router
    .route('/')
    .get(getClaims)
    .post(validate(createClaimSchema), createClaim);

router.route('/:id').get(getClaimById);

// Only admin can approve/reject claims
router.patch(
    '/:id/status',
    authorize('admin'),
    validate(updateClaimStatusSchema),
    updateClaimStatus
);

export default router;
