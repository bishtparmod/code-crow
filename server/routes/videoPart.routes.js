const express = require('express')
const router = express.Router()
const VideoPartCTRL = require('../controllers/videoPart.controller')

module.exports = router

router.get('/unsaved', VideoPartCTRL.unsavedVideoParts)

router.patch('/:id', VideoPartCTRL.updateVideoPart)

router.get('/:ssid/download', VideoPartCTRL.downloadVideoPart)

router.delete('/:ssid', VideoPartCTRL.deleteVideoPart)

router.get('/:ssid/play', VideoPartCTRL.playVideoPart)