const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth.controller')
const LoginLimiter = require('../middleware/LoginLimiter')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/register').post(AuthController.RegisterNewUser)
router.route('/login').post(LoginLimiter, AuthController.Login)
router.route('/refresh').get(AuthController.refresh)
//router.route('/logout').post(AuthController.logout)

router.route('/all').get(verifyJWT,AuthController.getAllUser)

module.exports = router