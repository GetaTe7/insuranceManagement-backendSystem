import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import Policy from '../src/modules/policies/policy.model.js';
import User from '../src/modules/auth/auth.model.js';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/env.js';

// Mock DB Models
jest.mock('../src/modules/policies/policy.model.js');
jest.mock('../src/modules/auth/auth.model.js');

describe('Policy Integration API', () => {
    let adminToken;

    beforeAll(() => {
        // Generate a valid mock token for the admin using secret from env script
        adminToken = jwt.sign({ id: 'admin123' }, config.jwtSecret || 'test-secret', { expiresIn: '1h' });

        // Fallback secret for JWT verification in middleware if config is missing during test
        config.jwtSecret = config.jwtSecret || 'test-secret';
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/v1/policies', () => {
        it('should successfully create a policy when called by an admin', async () => {
            const mockPolicyData = {
                policyNumber: 'POL-12345',
                policyHolder: 'user123',
                type: 'Life',
                premiumAmount: 150,
                coverageAmount: 100000,
                startDate: '2026-01-01',
                endDate: '2036-01-01',
            };

            // 1. Mock the auth middleware finding the admin user
            User.findById.mockResolvedValue({ _id: 'admin123', role: 'admin' });

            // 2. Mock the Policy creation
            Policy.create.mockResolvedValue({ ...mockPolicyData, _id: 'newPolicyId', agent: 'admin123' });

            // Execute request attached to Express app
            const response = await request(app)
                .post('/api/v1/policies')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(mockPolicyData);
            require('fs').writeFileSync('policy_error.json', JSON.stringify(response.body, null, 2));

            // Assertions
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Policy created successfully');
            expect(response.body.data.policyNumber).toBe('POL-12345');

            // Verify mocks were called
            expect(User.findById).toHaveBeenCalledWith('admin123');
            expect(Policy.create).toHaveBeenCalled();
        });

        it('should return 401 if no token provided', async () => {
            const response = await request(app)
                .post('/api/v1/policies')
                .send({});

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Not authorized');
        });

        it('should return 403 if user is a standard customer', async () => {
            // Customer mock token
            const customerToken = jwt.sign({ id: 'cust1' }, config.jwtSecret, { expiresIn: '1h' });

            // Mock the auth middleware finding a customer user
            User.findById.mockResolvedValue({ _id: 'cust1', role: 'customer' });

            const response = await request(app)
                .post('/api/v1/policies')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({}); // Payload doesn't matter, auth triggers first

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('is not authorized');
        });
    });
});
