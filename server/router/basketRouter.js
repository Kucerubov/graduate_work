const Router = require('express');
const router = new Router();
const basketController = require("../controllers/basket-controller");

router.post('/basket', basketController.getAll);
router.post('/add-basket', basketController.addDeviceInBasket);

module.exports = router;