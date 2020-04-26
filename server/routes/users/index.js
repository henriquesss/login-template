const router = require('express').Router()
const utils = require('../../helpers/utils')
const userController = require("../../controllers/userController")

router.post('/login', userController.login);
router.post('/resetPassword', userController.resetPassword);
router.post('/addUser', userController.addUser);
router.put('/editUser', utils.handleAuth, userController.editUser);
router.get('/getUser', utils.handleAuth, userController.getUserById);
router.get('/getUsers', utils.handleAuth, userController.getUsers);


module.exports = router

