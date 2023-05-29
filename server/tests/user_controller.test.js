const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiErrors = require('../exception/api-error');
const UserController = require('../controllers/user-controller');

jest.mock('express-validator', () => ({
    validationResult: jest.fn()
}));

jest.mock('../exception/api-error', () => ({
    BadRequest: jest.fn().mockImplementation((message, errors) => {
        return new Error(`${message}: ${JSON.stringify(errors)}`);
    })
}));

describe('UserController', () => {
    describe('registration', () => {
        it('should register a new user and return user data', async () => {
            const req = {
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'testpassword',
                    role: 'user'
                }
            };
            const res = {
                json: jest.fn(),
                cookie: jest.fn()
            };
            const next = jest.fn();

            validationResult.mockReturnValueOnce({ isEmpty: jest.fn().mockReturnValue(true) });

            userService.registration = jest.fn().mockResolvedValue({ refreshToken: 'testtoken' });

            await UserController.registration(req, res, next);

            expect(validationResult).toHaveBeenCalledWith(req);
            expect(userService.registration).toHaveBeenCalledWith('testuser', 'test@example.com', 'testpassword', 'user');
            expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'testtoken', expect.any(Object));
            expect(res.json).toHaveBeenCalledWith({ refreshToken: 'testtoken' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle validation errors and call next with BadRequest error', async () => {
            const req = {
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'testpassword',
                    role: 'user'
                }
            };
            const res = {
                json: jest.fn()
            };
            const next = jest.fn();

            const validationErrors = [{ msg: 'Invalid username' }];
            validationResult.mockReturnValue({
                isEmpty: jest.fn().mockReturnValue(false),
                array: jest.fn().mockReturnValue(validationErrors)
            });

            await UserController.registration(req, res, next);

            expect(validationResult).toHaveBeenCalled();
            expect(validationResult).toHaveBeenCalledWith(req);
            expect(validationResult().isEmpty).toHaveBeenCalled();
            expect(validationResult().isEmpty).toHaveReturnedWith(false);

            expect(userService.registration).toHaveBeenCalledWith(
                req.body.username,
                req.body.email,
                req.body.password,
                req.body.role
            );
        });

        it('should handle errors and call next', async () => {
            const req = {
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'testpassword',
                    role: 'user'
                }
            };
            const res = {
                json: jest.fn()
            };
            const next = jest.fn();

            const error = new Error('Some error');
            validationResult.mockReturnValueOnce({ isEmpty: jest.fn().mockReturnValue(true) });
            userService.registration = jest.fn().mockRejectedValue(error);

            await UserController.registration(req, res, next);

            expect(validationResult).toHaveBeenCalledWith(req);
            expect(userService.registration).toHaveBeenCalledWith('testuser', 'test@example.com', 'testpassword', 'user');
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('login', () => {
        it('should login user and return user data', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'testpassword'
                }
            };
            const res = {
                json: jest.fn(),
                cookie: jest.fn()
            };
            const next = jest.fn();

            userService.login = jest.fn().mockResolvedValue({ refreshToken: 'testtoken' });

            await UserController.login(req, res, next);

            expect(res.json).toHaveBeenCalledWith({ refreshToken: 'testtoken' });
            expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'testtoken', expect.any(Object));
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors and call next', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'testpassword'
                }
            };
            const res = {
                json: jest.fn()
            };
            const next = jest.fn();
            const error = new Error('Test Error');

            userService.login = jest.fn().mockRejectedValue(error);

            await UserController.login(req, res, next);

            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('logout', () => {
        it('should logout user, clear refreshToken cookie, and return token', async () => {
            const req = {
                cookies: {
                    refreshToken: 'testtoken'
                }
            };
            const res = {
                json: jest.fn(),
                clearCookie: jest.fn()
            };
            const next = jest.fn();

            userService.logout = jest.fn().mockResolvedValue('testtoken');

            await UserController.logout(req, res, next);

            expect(res.json).toHaveBeenCalledWith({ token: 'testtoken' });
            expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors and call next', async () => {
            const req = {
                cookies: {
                    refreshToken: 'testtoken'
                }
            };
            const res = {
                json: jest.fn()
            };
            const next = jest.fn();
            const error = new Error('Test Error');

            userService.logout = jest.fn().mockRejectedValue(error);

            await UserController.logout(req, res, next);

            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('activate', () => {
        it('should activate user and redirect to homepage', async () => {
            const req = {
                params: {
                    link: 'activationLink'
                }
            };
            const res = {
                redirect: jest.fn()
            };
            const next = jest.fn();

            userService.activate = jest.fn();

            await UserController.activate(req, res, next);

            expect(userService.activate).toHaveBeenCalledWith('activationLink');
            expect(res.redirect).toHaveBeenCalledWith('http://localhost:3000/');
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors and call next', async () => {
            const req = {
                params: {
                    link: 'activationLink'
                }
            };
            const res = {
                redirect: jest.fn()
            };
            const next = jest.fn();
            const error = new Error('Test Error');

            userService.activate = jest.fn().mockRejectedValue(error);

            await UserController.activate(req, res, next);

            expect(res.redirect).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('refresh', () => {
        it('should refresh user token and return user data', async () => {
            const req = {
                cookies: {
                    refreshToken: 'testtoken'
                }
            };
            const res = {
                json: jest.fn(),
                cookie: jest.fn()
            };
            const next = jest.fn();

            userService.refresh = jest.fn().mockResolvedValue({ refreshToken: 'newtoken' });

            await UserController.refresh(req, res, next);

            expect(res.json).toHaveBeenCalledWith({ refreshToken: 'newtoken' });
            expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'newtoken', expect.any(Object));
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors and call next', async () => {
            const req = {
                cookies: {
                    refreshToken: 'testtoken'
                }
            };
            const res = {
                json: jest.fn()
            };
            const next = jest.fn();
            const error = new Error('Test Error');

            userService.refresh = jest.fn().mockRejectedValue(error);

            await UserController.refresh(req, res, next);

            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });

});