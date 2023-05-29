const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiErrors = require('../exception/api-error');

class UserController{
    async registration(req, res, next){
        try {
            console.log(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                return next(ApiErrors.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {username, email, password, role} = req.body;
            const userData = await userService.registration(username, email, password, role);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 4 * 24 * 60 * 60 * 1000, httpOnly:true})
            return res.json(userData);
        }catch (e){
           next(e);
        }
    }

    async login(req, res, next){
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 4 * 24 * 60 * 60 * 1000, httpOnly:true})
            return res.json(userData);
        }catch (e){
            next(e);
        }
    }

    async logout(req, res, next){
        console.log('wtg ' + req);
        try {

            const {refreshToken} = req.cookies;
            const  token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json({ token });
        }catch (e){
            next(e);
        }
    }

    async activate(req, res, next){
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect("http://localhost:3000/");
        }catch (e){
            next(e);
        }
    }

    async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 4 * 24 * 60 * 60 * 1000, httpOnly:true})
            return res.json(userData);
        }catch (e){
            next(e);
        }
    }
}

module.exports = new  UserController();