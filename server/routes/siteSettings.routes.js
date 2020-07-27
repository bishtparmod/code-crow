const express = require('express')
const router = express.Router()
const siteSettingsCTRL = require('../controllers/siteSettings.controller')

module.exports = router

router.get('/maintenanceMode', siteSettingsCTRL.getMaintenanceMode)

router.patch('/maintenanceMode', siteSettingsCTRL.setMaintenanceMode)