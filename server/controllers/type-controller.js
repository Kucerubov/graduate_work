const {Type} = require('../models/models');
const ApiError = require('../exception/api-error');
class TypeController {
    async create(req, res, next) {
        try {
            const {name} = req.body;
            const type = await Type.create({name});
            return res.json(type);
        } catch (e) {
            next(e)
        }
    }

    async getAll(req, res, next) {
        try {
            const types = await Type.findAll();
            return res.json(types);
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new TypeController();