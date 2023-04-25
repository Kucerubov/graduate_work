const {BasketDevice, Device} = require("../models/models");
const BasketService = require("../service/basket-service");

class BasketController {
    async getAll(req, res, next) {
        try {
            const { basketId } = req.body;
            const deviceInBasket = await BasketDevice.findAll({ where: { basketId } });
            const arrayDevice = await Promise.all(
                deviceInBasket.map(({ deviceId }) =>
                    Device.findOne({ where: { id: deviceId } })
                )
            );
            return res.json(arrayDevice);
        } catch (error) {
            next(error);
        }
    }

    async addDeviceInBasket(req, res, next){
        try {
            const refreshToken = req.cookies.refreshToken;
            const data = await BasketService.addDeviceInBasket(refreshToken);
            return res.json(data);
        }catch (e) {
            next(e);
        }
    }
}

module.exports = new BasketController();