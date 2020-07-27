const UploadMiddleware = require('../middlewares/upload.middleware')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer()
const S3Helper = require('../helpers/s3.helper')
const LegalCTRL = require('../controllers/legal.controller')

module.exports = router

router.get('', LegalCTRL.getLegalDocs)
router.get('/get/objects', S3Helper.listObjects)
router.post('', upload.single('file'), UploadMiddleware, LegalCTRL.createLegalDoc)