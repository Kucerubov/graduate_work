const tokenService = require("./token-service");
const ApiError = require("../exception/api-error");
const {BasketDevice, Device} = require("../models/models");

class BasketService {
    async addDeviceInBasket(refreshToken, deviceId, basketId) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const data = tokenService.validateRefreshToken(refreshToken);
        if (!data) {
            throw ApiError.UnauthorizedError();
        }
        return await BasketDevice.create({basketId, deviceId});
    }

    async getDeviceInBasket(refreshToken, basketId){
        if(!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const data = tokenService.validateRefreshToken(refreshToken);
        if(!data){
            throw ApiError.UnauthorizedError();
        }
        const deviceInBasket = await BasketDevice.findAll({ where: { basketId } });
        console.log("get dev " + deviceInBasket);
        return await Promise.all(
            deviceInBasket.map(({deviceId}) =>
                 Device.findOne({where: {id: deviceId}})
            )
        );
    }
}

module.exports = new BasketService();