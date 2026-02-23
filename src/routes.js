import express from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import policyRoutes from './modules/policies/policy.routes.js';
import claimRoutes from './modules/claims/claim.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/policies', policyRoutes);
router.use('/claims', claimRoutes);


export default router;

