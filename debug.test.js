import { jest } from '@jest/globals';
import request from 'supertest';
import app from './src/app.js';
import User from './src/modules/auth/auth.model.js';
import Policy from './src/modules/policies/policy.model.js';
import jwt from 'jsonwebtoken';
import { config } from './src/config/env.js';

jest.mock('./src/modules/auth/auth.model.js', () => ({
    findById: jest.fn()
}));

jest.mock('./src/modules/policies/policy.model.js', () => ({
    create: jest.fn()
}));

async function run() {
    try {
        config.jwtSecret = 'test-secret';
        const token = jwt.sign({ id: 'admin123' }, 'test-secret');

        User.findById.mockResolvedValue({ _id: 'admin123', role: 'admin' });
        Policy.create.mockResolvedValue({ policyNumber: 'POL-123' });

        const res = await request(app)
            .post('/api/v1/policies')
            .set('Authorization', `Bearer ${token}`)
            .send({});

        console.log('RESPONSE STATUS:', res.status);
        console.log('RESPONSE BODY:', JSON.stringify(res.body, null, 2));
    } catch (e) { console.error(e); }
}

run();
