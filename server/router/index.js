const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const assemblyController = require('../controllers/assembly_controller')
const router = new Router();
const {body} = require('express-validator');

const deviceRouter = require('./deviceRouter');
const typeRouter = require('./typeRouter');
const brandRouter = require('./brandRouter');
const basketRouter = require('./basketRouter');

router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device',deviceRouter);
router.use('/', basketRouter);

router.post('/registration',
    body('username').isLength({min: 3, max: 32}),
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
);

router.get('/assembly/:id', assemblyController.getAssembly);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);

module.exports = router;