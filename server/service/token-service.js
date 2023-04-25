const jwt = require('jsonwebtoken');
const JWT_ACCESS_SECRET = 'jwt-secret-key';
const JWT_REFRESH_SECRET = 'jwt-refresh-secret-key';
const {Token} = require('../models/models');

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn:'15m'});
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn:'4d'});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token){
        try {
            return jwt.verify(token, JWT_ACCESS_SECRET);
        }catch (e) {
            return null;
        }
    }

    validateRefreshToken(token){
        try {
            return jwt.verify(token, JWT_REFRESH_SECRET);
        }catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({where: {userId}});
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        return await Token.create({user: userId, refreshToken}) // return token
    }

    async removeToken(refreshToken) {
        console.log('refresh token' + refreshToken);
        return await Token.destroy({where: {refreshToken}});
    }

    async findToken(refreshToken) {
        return await Token.findOne({where: {refreshToken}});
    }

}

module.exports = new TokenService();