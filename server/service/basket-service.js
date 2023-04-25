const tokenService = require("./token-service");
const ApiError = require("../exception/api-error");

class BasketService {
    addDeviceInBasket(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const data = tokenService.validateRefreshToken(refreshToken);

    }
}

module.exports = new BasketService();