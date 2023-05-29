const jwt = require('jsonwebtoken');
const { Token } = require('../models/models');
const TokenService = require('../service/token-service');

jest.mock('jsonwebtoken');
jest.mock('../models/models');

describe('TokenService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('generateTokens', () => {
        it('should generate access and refresh tokens', () => {
            const payload = { userId: 1 };
            const accessToken = 'access_token';
            const refreshToken = 'refresh_token';

            jwt.sign.mockReturnValueOnce(accessToken);
            jwt.sign.mockReturnValueOnce(refreshToken);

            const tokens = TokenService.generateTokens(payload);

            expect(jwt.sign).toHaveBeenCalledWith(payload, 'jwt-secret-key', { expiresIn: '30m' });
            expect(jwt.sign).toHaveBeenCalledWith(payload, 'jwt-refresh-secret-key', { expiresIn: '4d' });
            expect(tokens).toEqual({ accessToken, refreshToken });
        });
    });

    describe('validateAccessToken', () => {
        it('should return the payload if the access token is valid', () => {
            const payload = { userId: 1 };
            const accessToken = 'valid_access_token';

            jwt.verify.mockReturnValueOnce(payload);

            const result = TokenService.validateAccessToken(accessToken);

            expect(jwt.verify).toHaveBeenCalledWith(accessToken, 'jwt-secret-key');
            expect(result).toEqual(payload);
        });

        it('should return null if the access token is invalid', () => {
            const accessToken = 'invalid_access_token';

            jwt.verify.mockImplementationOnce(() => {
                throw new Error();
            });

            const result = TokenService.validateAccessToken(accessToken);

            expect(jwt.verify).toHaveBeenCalledWith(accessToken, 'jwt-secret-key');
            expect(result).toBeNull();
        });
    });

    describe('validateRefreshToken', () => {
        it('should return the payload if the refresh token is valid', () => {
            const payload = { userId: 1 };
            const refreshToken = 'valid_refresh_token';

            jwt.verify.mockReturnValueOnce(payload);

            const result = TokenService.validateRefreshToken(refreshToken);

            expect(jwt.verify).toHaveBeenCalledWith(refreshToken, 'jwt-refresh-secret-key');
            expect(result).toEqual(payload);
        });

        it('should return null if the refresh token is invalid', () => {
            const refreshToken = 'invalid_refresh_token';

            jwt.verify.mockImplementationOnce(() => {
                throw new Error();
            });

            const result = TokenService.validateRefreshToken(refreshToken);

            expect(jwt.verify).toHaveBeenCalledWith(refreshToken, 'jwt-refresh-secret-key');
            expect(result).toBeNull();
        });
    });

    describe('saveToken', () => {

        it('should create a new token if no existing token is found in the database', async () => {
            const userId = 1;
            const newRefreshToken = 'new_refresh_token';

            Token.findOne = jest.fn().mockResolvedValueOnce(null);
            Token.create = jest.fn().mockResolvedValueOnce({
                id: 1,
                userId,
                refreshToken: newRefreshToken,
            });

            const result = await TokenService.saveToken(userId, newRefreshToken);

            expect(Token.findOne).toHaveBeenCalledWith({ where: { userId } });
            expect(Token.create).toHaveBeenCalledWith({ user: userId, refreshToken: newRefreshToken });
            expect(result).toEqual({
                id: 1,
                userId,
                refreshToken: newRefreshToken,
            });
        });
    });


    describe('removeToken', () => {
        it('should remove the token from the database', async () => {
            const refreshToken = 'refresh_token';

            Token.destroy.mockResolvedValueOnce(1);

            const result = await TokenService.removeToken(refreshToken);

            expect(Token.destroy).toHaveBeenCalledWith({ where: { refreshToken } });
            expect(result).toBe(1);
        });
    });

    describe('findToken', () => {
        it('should find the token in the database', async () => {
            const refreshToken = 'refresh_token';
            const token = { refreshToken };

            Token.findOne.mockResolvedValueOnce(token);

            const result = await TokenService.findToken(refreshToken);

            expect(Token.findOne).toHaveBeenCalledWith({ where: { refreshToken } });
        });
    });
});
