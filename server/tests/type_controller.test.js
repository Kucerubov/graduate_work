const { Type } = require('../models/models');
const TypeController = require('../controllers/type-controller');

jest.mock('express-validator', () => ({
    validationResult: jest.fn()
}));
describe('TypeController', () => {
    describe('create', () => {
        it('should create a new type and return it', async () => {
            const req = {
                body: {
                    name: 'Test Type'
                }
            };
            const res = {
                json: jest.fn()
            };
            const next = jest.fn();

            Type.create = jest.fn().mockResolvedValue({name: 'Test Type'});

            await TypeController.create(req, res, next);

            expect(Type.create).toHaveBeenCalledWith({name: 'Test Type'});
            expect(res.json).toHaveBeenCalledWith({name: 'Test Type'});
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors and call next with ApiError', async () => {
            const req = {
                body: {
                    name: 'Test Type'
                }
            };
            const res = {
                json: jest.fn()
            };
            const next = jest.fn();

            const error = new Error('Some error');
            Type.create = jest.fn().mockRejectedValue(error);

            await TypeController.create(req, res, next);

            expect(Type.create).toHaveBeenCalledWith({name: 'Test Type'});
            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });


    describe('getAll', () => {
        it('should get all types and return them', async () => {
            const req = {};
            const res = {
                json: jest.fn()
            };
            const next = jest.fn();
            const types = [
                {name: 'Type 1'},
                {name: 'Type 2'}
            ];

            Type.findAll = jest.fn().mockResolvedValue(types);

            await TypeController.getAll(req, res, next);

            expect(res.json).toHaveBeenCalledWith(types);
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle errors and call next', async () => {
            const req = {};
            const res = {
                json: jest.fn()
            };
            const next = jest.fn();
            const error = new Error('Test Error');

            Type.findAll = jest.fn().mockRejectedValue(error);

            await TypeController.getAll(req, res, next);

            expect(res.json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
