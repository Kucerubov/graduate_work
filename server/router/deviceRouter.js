const Router = require('express');
const router = new Router();
const deviceController = require("../controllers/device-controller");
const checkRole = require("../middleware/check-role-middleware");

router.post('/', checkRole('ADMIN'), deviceController.create);
router.get('/withInfo', deviceController.getAllWithInfo);
router.get('/', deviceController.getAll);
router.get('/:id', deviceController.getOne);

module.exports = router;