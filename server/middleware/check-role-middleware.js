const authMiddleware = require('./auth-middleware');

module.exports = function (role) {
    return authMiddleware(role);
};