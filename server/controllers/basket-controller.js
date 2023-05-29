const BasketService = require("../service/basket-service");

class BasketController {
    async getAll(req, res, next) {
        try {
            const { basketId } = req.body;
            const refreshToken = req.cookies.refreshToken;
            const arrayDevice = await BasketService.getDeviceInBasket(refreshToken, basketId);
            return res.json(arrayDevice);
        } catch (error) {
            next(error);
        }
    }

    async addDeviceInBasket(req, res, next){
        try {
            const refreshToken = req.cookies.refreshToken;
            const {basketId, deviceId} = req.body;
            const data = await BasketService.addDeviceInBasket(refreshToken, deviceId, basketId);
            return res.json(data);
        }catch (e) {
            next(e);
        }
    }
}

module.exports = new BasketController();