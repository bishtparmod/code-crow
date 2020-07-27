const express = require('express')
const router = express.Router()
const streamTimeCTRL = require('../controllers/streamTime.controller')

module.exports = router

router.get('/user', streamTimeCTRL.getUserStreamTime)
router.post('/', streamTimeCTRL.createStreamTime)
