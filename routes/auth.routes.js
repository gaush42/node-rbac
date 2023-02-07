const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth.controller')
const LoginLimiter = require('../middleware/LoginLimiter')

router.route('/register').post(AuthController.RegisterNewUser)
router.route('/login').post(LoginLimiter, AuthController.Login)

module.exports = router