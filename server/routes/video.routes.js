const express = require('express')
const router = express.Router()
const S3Helper = require('../helpers/s3.helper')
const videoCTRL = require('../controllers/video.controller')

module.exports = router

router.get('/', videoCTRL.getVideos)
router.post('/', videoCTRL.createVideoFromURL)
router.get('/all', videoCTRL.getAllVideos)
router.get('/:id', videoCTRL.getVideo)
router.get('/:id/signedURL', S3Helper.getPresignedURL)
router.post('/:id/like', videoCTRL.likeVideo)
router.post('/:id/comment', videoCTRL.addComment)
router.patch('/:id/hide', videoCTRL.toggleVideoActivation)
router.delete('/:id', S3Helper.deleteVideo)
