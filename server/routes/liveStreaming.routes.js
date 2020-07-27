const express = require('express')
const router = express.Router()
const LiveSteramingCTRL = require('../controllers/liveStreaming.controller')

module.exports = router

router.get('/', LiveSteramingCTRL.getLiveStreams)

router.get('/me/montly', LiveSteramingCTRL.getMyLiveStreams)

router.post('/', LiveSteramingCTRL.createLiveStreaming)

router.post('/:id/participant', LiveSteramingCTRL.addParticipant)

router.patch('/:id/participant/rate', LiveSteramingCTRL.rateStream)

router.patch('/:id/participant/end', LiveSteramingCTRL.endParticipant)

router.patch('/:id/end', LiveSteramingCTRL.endLiveStream)