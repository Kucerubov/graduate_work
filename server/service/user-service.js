const {User, Basket, Token} = require('../models/models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailServices = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exception/api-error');

class UserService {
    async registration(userName, email, password, role){
        const candidateUserName = await User.findOne({where: {userName}});
        if(candidateUserName){
            throw  ApiError.BadRequest(`Пользователь с таким именем ${userName} уже существует`)
        }
        const candidateEmail = await User.findOne({where: {email}});
        if(candidateEmail){
            throw  ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await User.create({userName, email, password: hashPassword, activationLink, role})
        const basket = await Basket.create({userId: user.id});
        await mailServices.sendActivationMail(email, `http://localhost:5000/api/activate/${activationLink}`);
        const userDto = new UserDto(user); // id, email, isActivated, role
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            basket,
            user: userDto
        }
    }
    async activate(activationLink){
        const user = await User.findOne({where: {activationLink}})
        if(!user){
            throw ApiError.BadRequest('Некорректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await User.findOne({where: {email}});

        if(!user){
            throw ApiError.BadRequest("Пользователь с таким email не зарегистрирован!")
        }
        const isPassEquals = await bcrypt.compare(password, user.password);

        if(!isPassEquals) {
            throw ApiError.BadRequest('Неверный логин или пароль');
        }

        const basket = await Basket.findOne({userId: user.id});
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            basket,
            user: userDto
        }
    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if(!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }else {
            await tokenService.removeToken(refreshToken);
        }
        const user = await User.findByPk(userData.id);
        const basket = await Basket.findOne({userId: user.id})
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
            basket: basket
        }
    }
}

module.exports = new UserService();