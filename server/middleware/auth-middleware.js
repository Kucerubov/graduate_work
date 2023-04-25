const ApiError = require('../exception/api-error');
const tokenService = require('../service/token-service');

function authMiddleware(role) {
    return function (req, res, next) {
        console.log(req);
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return next(ApiError.UnauthorizedError());
            }

            const accessToken = authorizationHeader.split(' ')[1];
            if (!accessToken) {
                return next(ApiError.UnauthorizedError());
            }

            const userData = tokenService.validateAccessToken(accessToken);
            if (!userData) {
                return next(ApiError.UnauthorizedError());
            }

            if (role && userData.role !== role) {
                return next(ApiError.UnauthorizedError());
            }

            req.user = userData;
            next();
        } catch (e) {
            return next(ApiError.UnauthorizedError());
        }
    };
}

module.exports = authMiddleware;