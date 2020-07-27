const NewsCTRL = require('../controllers/news.controller')
const UploadMiddleware = require('../middlewares/upload.middleware')
const express = require('express')
const multer = require('multer')
const upload = multer()
const router = express.Router()
const S3Helper = require('../helpers/s3.helper')

module.exports = router

router.post('', upload.single('file'), UploadMiddleware, NewsCTRL.createNews)
router.get('', NewsCTRL.getNews)
router.get('/:id', NewsCTRL.getUserNewsById)
router.get('/unseen/me', NewsCTRL.getUserNews)
router.get('/get/objects', S3Helper.listObjects)