const express = require("express");
const multer = require("multer");
const router = express.Router();
const AWS = require("aws-sdk");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET
});

const s3 = new AWS.S3({
  httpOptions: { timeout: 0 },
  params: { Bucket: process.env.S3_BUCKET_ATTACHMENTS }
});

router.post("/uploadFile", upload.single("file"), (req, res) => {
  try {
    const data = req.file;
    const type = data.mimetype;
    const name = data.originalname;
    const size = data.size;

    const params = {
      Bucket: process.env.S3_BUCKET_ATTACHMENTS,
      Key: size + "/" + name,
      Body: data.buffer,
      ACL: "public-read"
    };

    s3.upload(params, (err, data) => {
      if (err) {
        res.status(500).json({ error: "Error -> " + err });
      }
      res.json({
        message: "File uploaded successfully",
        name,
        location: data.Location,
        size,
        type
      });
    });
  } catch (err) {
    res.send(400);
  }
});

module.exports = router;
