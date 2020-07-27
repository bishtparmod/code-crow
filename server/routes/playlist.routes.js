const express = require('express')
const router = express.Router()
const videoCTRL = require('../controllers/playlist.controller')

module.exports = router

router.get('/', videoCTRL.getPlayLists)
router.get('/:id', videoCTRL.getPlayList)
router.post('/', videoCTRL.createPlaylist)
router.patch('/:id/video/:fk', videoCTRL.addVideo)
router.delete('/:id/video/:fk', videoCTRL.removeVideo)
router.patch('/:id', videoCTRL.updatePlayList)
router.delete('/:id', videoCTRL.deletePlaylist)
