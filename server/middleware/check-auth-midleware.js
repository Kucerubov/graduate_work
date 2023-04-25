const authMiddleware = require('./auth-middleware');

module.exports = function (req, res, next) {
    authMiddleware()(req, res, next);
};