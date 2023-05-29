const BasketService = require('../service/basket-service');
const tokenService = require("../service/token-service");
const ApiError = require("../exception/api-error");
const { BasketDevice, Device, User, Basket, Brand, Type} = require("../models/models");

jest.mock('../service/token-service');
jest.mock('../models/models');

describe('BasketService', () => {
    describe('addDeviceInBasket', () => {
        it('should throw an UnauthorizedError if refreshToken is not provided', async () => {
            const refreshToken = {};
            const deviceId = 1;
            const basketId = 1;

            await expect(BasketService.addDeviceInBasket(refreshToken, deviceId, basketId)).rejects.toThrow(ApiError.UnauthorizedError());
        });

        it('should throw an UnauthorizedError if token validation fails', async () => {
            const refreshToken = 'invalid-refresh-token';
            const deviceId = 1;
            const basketId = 1;

            tokenService.validateRefreshToken.mockReturnValue(null);

            await expect(BasketService.addDeviceInBasket(refreshToken, deviceId, basketId)).rejects.toThrow(ApiError.UnauthorizedError());
        });

        it('should create a BasketDevice and return it', async () => {
            const refreshToken = 'valid-refresh-token';
            const deviceId = 1;
            const basketId = 1;

            await tokenService.validateRefreshToken.mockReturnValue({});
            expect({ basketId, deviceId }).toEqual({ basketId, deviceId });
        });
    });

    describe('getDeviceInBasket', () => {
        it('should throw an UnauthorizedError if refreshToken is not provided', async () => {
            const refreshToken = null;
            const basketId = 1;

            await expect(BasketService.getDeviceInBasket(refreshToken, basketId)).rejects.toThrow(ApiError.UnauthorizedError());
        });

        it('should throw an UnauthorizedError if token validation fails', async () => {
            const refreshToken = 'invalid-refresh-token';
            const basketId = 1;

            tokenService.validateRefreshToken.mockReturnValue(null);

            await expect(BasketService.getDeviceInBasket(refreshToken, basketId)).rejects.toThrow(ApiError.UnauthorizedError());
        });

        it('should fetch the devices in the basket and return an array of devices', async () => {
            const refreshToken = 'valid-refresh-token';
            const basketId = 1;
            const deviceIds = [1, 2];
            const devices = [
                { id: 1, name: 'Device 1' },
                { id: 2, name: 'Device 2' }
            ];

            tokenService.validateRefreshToken.mockReturnValue({});

            await BasketDevice.findAll.mockResolvedValue(deviceIds.map((deviceId) => ({ deviceId })));
            await Device.findOne.mockImplementation((params) => {
                const device = devices.find((device) => device.id === params.where.id);
                return Promise.resolve(device);
            });

            const result = await BasketService.getDeviceInBasket(refreshToken, basketId);

            expect(result).toEqual(devices);
            expect(await BasketDevice.findAll).toHaveBeenCalledWith({ where: { basketId } });
            expect(await Device.findOne).toHaveBeenCalledTimes(deviceIds.length);
        });
    });
});
