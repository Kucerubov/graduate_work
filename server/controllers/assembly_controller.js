const {PCAssembly} = require("../models/models");

class Assembly_controller {
    async getAssembly(req, res, next) {
        try {
            const {id} = req.params;
            const data = await PCAssembly.findOne(
                {
                    userId: {id},
                }
            )
            return res.json(data);
        }catch (error) {
            next(error);
        }
    }

    async addDeviceInAssembly (req, res, next) {
        try {

        }catch (e) {
            next(e);
        }
    }
}


module.exports = new Assembly_controller();