const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth.controller')
const LoginLimiter = require('../middleware/LoginLimiter')
const verifyJWT = require('../middleware/verifyJWT')
const ROLES_LIST = require('../config/rolesList')
const verifyRoles = require('../middleware/verifyRoles')

router.route('/register').post(AuthController.RegisterNewUser)
router.route('/login').post(LoginLimiter, AuthController.Login)
router.route('/refresh').get(AuthController.refresh)
//router.route('/logout').post(AuthController.logout)

router.route('/all').get(verifyJWT, verifyRoles('admin'),AuthController.getAllUser)

module.exports = router