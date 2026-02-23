import express from 'express';
import {
    createPolicy,
    getPolicies,
    getPolicyById,
    updatePolicy,
    cancelPolicy,
} from './policy.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import protect from '../../middlewares/auth.middleware.js';
import authorize from '../../middlewares/role.middleware.js';
import {
    createPolicySchema,
    updatePolicySchema,
} from './policy.validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router
    .route('/')
    .get(getPolicies)
    .post(authorize('admin', 'agent'), validate(createPolicySchema), createPolicy);

router
    .route('/:id')
    .get(getPolicyById)
    .put(authorize('admin', 'agent'), validate(updatePolicySchema), updatePolicy);

router.patch(
    '/:id/cancel',
    authorize('admin', 'agent'),
    cancelPolicy
);

export default router;
