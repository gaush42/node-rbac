const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const verifyJWT = require('../middleware/verifyJWT')
const ROLES_LIST = require('../config/rolesList')
const verifyRoles = require('../middleware/verifyRoles')

router.use(verifyJWT)
router.route('/update/:id').patch(verifyRoles('admin'),userController.updateUserRole)
router.route('/delete/:id').delete(verifyRoles('admin'),userController.deleteUser)
router.route('/getall').get(verifyRoles('admin'),userController.getAllUser)

module.exports = router