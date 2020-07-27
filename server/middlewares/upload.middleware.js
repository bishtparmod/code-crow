const AWS = require('aws-sdk');
const utils = require('../helpers/utils')

AWS.config.update({
  accessKeyId: process.env.aws_access_key,
  secretAccessKey: process.env.aws_access_secret
});

const s3 = new AWS.S3();

module.exports = (req, res, next) => {
  if (!req.file)
    return next()

  const userId = req.user._id
  const { file, bucketName } = req

  const params = {
    Bucket: utils.getBucketNameFromID(bucketName),
    Body: file.buffer,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: file.type,
    Key: `${userId}/${Date.now()}_${file.originalname}`
  }

  s3.upload(params, (err, data) => {
    if (err) res.status(500).json(err)
    console.log(data.Location)
    req.body.pictureURL = data.Location
    next()
  })
}