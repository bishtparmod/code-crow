const mailHelper = require('../helpers/email.helper')
const express = require('express')
const router = express.Router()

module.exports = router

router.post('/send', mailHelper.sendEmailExpress)