
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailServices = require('../service/mail-service');
const tokenService = require('../service/token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exception/api-error');
const UserService = require('../service/user-service');
const { User, Basket } = require('../models/models');

jest.mock('../service/mail-service');
jest.mock('../service/token-service');
jest.mock('../models/models');
jest.mock('bcrypt');
jest.mock('../dtos/user-dto');

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registration', () => {
        it('should register a new user and return tokens, basket, and user DTO', async () => {
            // Mock the necessary dependencies
            const userName = 'testuser';
            const email = 'test@example.com';
            const password = 'testpassword';
            const role = 'user';
            const activationLink = uuid.v4();

            User.findOne.mockResolvedValueOnce(null);
            User.findOne.mockResolvedValueOnce(null);
            bcrypt.hash.mockResolvedValueOnce('hashedpassword');
            User.create.mockResolvedValueOnce({
                id: 1,
                userName,
                email,
                password: 'hashedpassword',
                activationLink,
                role
            });
            Basket.create.mockResolvedValueOnce({ id: 1 });

            const tokens = {
                accessToken: 'accessToken',
                refreshToken: 'refreshToken'
            };
            tokenService.generateTokens = jest.fn().mockReturnValue(tokens);

            const result = await UserService.registration(userName, email, password);

            expect(User.findOne).toHaveBeenCalledTimes(2);
            expect(User.findOne).toHaveBeenCalledWith({ where: { userName } });
            expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
            expect(bcrypt.hash).toHaveBeenCalledWith(password, 3);
            expect(Basket.create).toHaveBeenCalledWith({ userId: 1 });
        });


        it('should throw a BadRequest error if the username already exists', async () => {
            const userName = 'testuser';
            const email = 'test@example.com';
            const password = 'testpassword';
            const role = 'user';

            User.findOne.mockResolvedValueOnce({userName});

            await expect(UserService.registration(userName, email, password, role)).rejects.toThrow(
                ApiError.BadRequest('Пользователь с таким именем testuser уже существует')
            );

            expect(User.findOne).toHaveBeenCalledWith({where: {userName}});
            expect(User.create).not.toHaveBeenCalled();
        });

        it('should throw a BadRequest error if the email already exists', async () => {
            const userName = 'testuser';
            const email = 'test@example.com';
            const password = 'testpassword';
            const role = 'user';

            User.findOne.mockResolvedValueOnce(null);
            User.findOne.mockResolvedValueOnce({email});

            await expect(UserService.registration(userName, email, password, role)).rejects.toThrow(
                ApiError.BadRequest('Пользователь с почтовым адресом test@example.com уже существует')
            );

            expect(User.findOne).toHaveBeenCalledTimes(2);
            expect(User.findOne).toHaveBeenCalledWith({where: {userName}});
            expect(User.findOne).toHaveBeenCalledWith({where: {email}});
            expect(User.create).not.toHaveBeenCalled();
        });
    });

    describe('activate', () => {
        it('should activate a user', async () => {
            const activationLink = uuid.v4();
            const user = {
                id: 1,
                save: jest.fn() // Создание заглушки для метода save()
            };

            User.findOne.mockResolvedValueOnce(user);

            await UserService.activate(activationLink);

            expect(User.findOne).toHaveBeenCalledWith({where: {activationLink}});
            expect(user.isActivated).toBe(true);
            expect(user.save).toHaveBeenCalled(); // Проверка вызова метода save()
        });

        it('should throw a BadRequest error if the activation link is invalid', async () => {
            const activationLink = uuid.v4();

            User.findOne.mockResolvedValueOnce(null);

            await expect(UserService.activate(activationLink)).rejects.toThrow(
                ApiError.BadRequest('Некорректная ссылка активации')
            );

            expect(User.findOne).toHaveBeenCalledWith({where: {activationLink}});
        });
    });

    describe('login', () => {
        it('should log in a user and return tokens, basket, and user DTO', async () => {
            const email = 'test@example.com';
            const password = 'testpassword';

            const user = { id: 1, password: 'hashedpassword' };
            const basket = { id: 1 };
            const tokens = { refreshToken: 'refreshToken', accessToken: 'accessToken' };
            const userDto = { id: 1, email, isActivated: true, role: 'user' };

            User.findOne.mockResolvedValueOnce(user);
            bcrypt.compare.mockResolvedValueOnce(true);
            Basket.findOne.mockResolvedValueOnce(basket);
            tokenService.generateTokens.mockReturnValueOnce(tokens);
            tokenService.saveToken.mockResolvedValueOnce(true);
            UserDto.mockReturnValueOnce(userDto);

            const result = await UserService.login(email, password);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
            expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
            expect(Basket.findOne).toHaveBeenCalledWith({ userId: user.id });
            expect(tokenService.generateTokens).toHaveBeenCalledWith(userDto);
            expect(tokenService.saveToken).toHaveBeenCalledWith(userDto.id, tokens.refreshToken);
        });

        it('should throw a BadRequest error if the user is not registered', async () => {
            const email = 'test@example.com';
            const password = 'testpassword';

            User.findOne.mockResolvedValueOnce(false);

            await expect(UserService.login(email, password)).rejects.toThrow(
                ApiError.BadRequest('Пользователь с таким email не зарегистрирован!')
            );

            expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(tokenService.generateTokens).not.toHaveBeenCalled();
            expect(tokenService.saveToken).not.toHaveBeenCalled();
        });

        it('should throw a BadRequest error if the password is incorrect', async () => {
            const email = 'test@example.com';
            const password = 'testpassword';

            const user = {userName: 'Ilya', email: 'test@example.com',  password: 'hashedpasswordвавав'};

            await User.findOne.mockResolvedValueOnce(user);
            await bcrypt.compare.mockResolvedValueOnce(false);

            await expect(UserService.login(email, password)).rejects.toThrow(
                ApiError.BadRequest('Неверный логин или пароль')
            );

            expect(User.findOne).toHaveBeenCalledWith({ where: { email } });
        });
    });

    describe('logout', () => {
        it('should remove the specified refresh token', async () => {
            const refreshToken = 'refreshToken';

            tokenService.removeToken.mockResolvedValueOnce(true);

            const result = await UserService.logout(refreshToken);

            expect(tokenService.removeToken).toHaveBeenCalledWith(refreshToken);
            expect(result).toBe(true);
        });
    });

    describe('refresh', () => {

        it('should remove the refresh token from the database and generate new tokens', async () => {
            const refreshToken = 'valid_refresh_token';
            const userId = 1;
            const user = { id: userId };
            const userDto = { id: userId, email: 'test@example.com', isActivated: true, role: 'user' };
            const tokens = { accessToken: 'new_access_token', refreshToken: 'new_refresh_token' };
            const basket = { id: 1 };

            tokenService.validateRefreshToken.mockReturnValueOnce({ id: userId });
            tokenService.findToken.mockResolvedValueOnce(refreshToken);
            User.findByPk.mockResolvedValueOnce(user);
            Basket.findOne.mockResolvedValueOnce(basket);
            UserDto.mockReturnValueOnce(userDto);
            tokenService.generateTokens.mockReturnValueOnce(tokens);

            const result = await UserService.refresh(refreshToken);

            expect(tokenService.removeToken).toHaveBeenCalledWith(refreshToken);
            expect(User.findByPk).toHaveBeenCalledWith(userId);
            expect(Basket.findOne).toHaveBeenCalledWith({ userId });
            expect(tokenService.saveToken).toHaveBeenCalledWith(userId, tokens.refreshToken);
            expect(result).toEqual({ ...tokens, user: userDto, basket });
        });
    });


});
