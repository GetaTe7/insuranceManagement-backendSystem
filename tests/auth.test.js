import { jest } from '@jest/globals';
import { registerUser } from '../src/modules/auth/auth.service.js';
import User from '../src/modules/auth/auth.model.js';

// Mock the User model
jest.mock('../src/modules/auth/auth.model.js');

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should successfully register a user and return a token', async () => {
            // Setup mock data
            const mockUserData = {
                name: 'Test Setup User',
                email: 'testsetup@example.com',
                password: 'password123',
            };

            const mockUserInstance = {
                ...mockUserData,
                _id: 'mockedObjectId123',
                getSignedJwtToken: jest.fn().mockReturnValue('mock-jwt-token'),
            };

            // Configure mock behavior
            User.create.mockResolvedValue(mockUserInstance);

            // Execute service
            const result = await registerUser(mockUserData);

            // Assertions
            expect(User.create).toHaveBeenCalledWith(mockUserData);
            expect(mockUserInstance.getSignedJwtToken).toHaveBeenCalled();
            expect(result.user).toEqual(mockUserInstance);
            expect(result.token).toBe('mock-jwt-token');
        });

        it('should throw an error if model creation fails', async () => {
            // Setup mock error
            User.create.mockRejectedValue(new Error('Database validation failed'));

            // Execute and Assert
            await expect(registerUser({ name: 'Fail' })).rejects.toThrow('Database validation failed');
        });
    });
});
