const express = require('express')
const router = express.Router()
const S3Helper = require('../helpers/s3.helper')

router.post('/upload-url', S3Helper.getUploadPresignedURL)

module.exports = router