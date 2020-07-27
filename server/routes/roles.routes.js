const express = require('express')
const router = express.Router()
const RolesCTRL = require('../controllers/roles.controller')
const AuthMiddlewares = require('../middlewares/auth.middleware')

module.exports = router

router.post('/', RolesCTRL.addRole)
router.get('/', RolesCTRL.getRoles)
router.get('/:roleId/users', RolesCTRL.getRoleUsers)
router.get('/roleMapping', RolesCTRL.getUserRoles)
router.post('/roleMapping', RolesCTRL.addRoleMapping)
router.patch('/roleMapping', RolesCTRL.deleteRoleMapping)