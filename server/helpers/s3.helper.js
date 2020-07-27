const fs = require("fs");
const AWS = require("aws-sdk");
const mkdirp = require("mkdirp");
const extractFrames = require("ffmpeg-extract-frames");
const ffmpeg = require("fluent-ffmpeg");
const VideoPart = require('../models/videoPart.model')
const Video = require("../models/video.model");
const VideoViews = require("../models/videoViews.model");
const ffmpegHelper = require("./ffmpeg.helper");
const utils = require("../helpers/utils");
const moment = require('moment')

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET
});

const s3 = new AWS.S3({
  httpOptions: { timeout: 0 },
  params: { Bucket: process.env.S3_BUCKET_VIDEOS }
});

const createVideoRecord = async ({ stream, channel, user, ssid, name }) => {
  try {
    const tempLocation = `public/temp_videos/${user}/${ssid}.webm`;
    const video = await VideoPart.create({
      stream,
      channel,
      user,
      tempLocation,
      isInProgress: true,
      ssid,
      deleteDate: moment().add('days', 14),
      name
    });
    return video;
  } catch (e) {
    return e;
  }
};

const appendToVideoFile = async ({ buffer, stream, channel, user, ssid }) => {
  mkdirp(`public/temp_videos/${user}/${channel}/`, async err => {
    fs.appendFile(`public/temp_videos/${user}/${ssid}.webm`, buffer, err => {
      if (err) {
        console.log(err);
        return err;
      }
      return true;
    });
  });
};

const uploadStreamToS3 = async ({ user, channel, stream, ssid }) => {
  try {
    const videoPart = await VideoPart.findOneAndUpdate({ ssid }, { isUploading: true }, { new: true })
    const frame = await ffmpegHelper.extractVideoThumbnail({ user, ssid });

    const videoStream = fs.createReadStream(
      `public/temp_videos/${user}/${ssid}.mp4`
    );
    const thumbnailStream = fs.createReadStream(
      `public/temp_videos/${user}/${ssid}.jpg`
    );
    const params = [
      { Key: `${user}/${ssid}.mp4`, Body: videoStream },
      {
        Key: `${user}/${ssid}.jpg`,
        Body: thumbnailStream,
        ACL: "public-read"
      }
    ];

    const upload = await Promise.all([
      s3.upload(params[0]).promise(),
      s3.upload(params[1]).promise()
    ]);
    const videoUpload = upload[0];
    const thumbnailUpload = upload[1];

    console.log('>> Video Uploaded', videoUpload)
    console.log('>> Thumbnail Uploaded', thumbnailUpload)

    fs.unlinkSync(`public/temp_videos/${user}/${ssid}.mp4`);
    fs.unlinkSync(`public/temp_videos/${user}/${ssid}.jpg`);

    await VideoPart.findOneAndDelete({ ssid })
    await Video.create({
      isUploaded: true,
      isUploading: false,
      Location: videoUpload.Location,
      Key: videoUpload.Key,
      thumbnail: {
        Location: thumbnailUpload.Location,
        Key: thumbnailUpload.Key
      },
      status: true,
      duration: Math.floor(videoPart.duration),
      title: videoPart.name,
      stream, channel, user,
    })
    return videoUpload
  } catch (e) {
    VideoPart.findOneAndUpdate({ ssid }, { isUploading: false })
    return false;
  }
};

const getPresignedURL = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const videoViews = await VideoViews.findOneAndUpdate(
      { video: id, user: userId },
      {
        $push: { viewsTimestamps: { date: new Date() } },
        $inc: { viewCounter: 1 }
      },
      { upsert: true, new: true }
    );
    const video = await Video.findById(id).exec();

    if (video.views.indexOf(videoViews.id) == -1) {
      video.views = [...video.views, videoViews.id];
      video.save();
    }

    const { Key } = video;
    const Expires = 3600;
    const url = await s3.getSignedUrlPromise("getObject", {
      Bucket: process.env.S3_BUCKET_VIDEOS,
      Key,
      Expires
    });
    res.status(200).json(url);
  } catch (e) {
    res.status(500).json(e);
  }
};

const getUploadPresignedURL = async (req, res) => {
  const { fileName, fileType, Key, bucketName } = req.body;
  const params = {
    Bucket: utils.getBucketNameFromID(bucketName),
    Key: `${Key}/${fileName}`,
    Expires: 1000,
    ContentType: fileType,
    ACL: "public-read"
  };
  try {
    const url = await s3.getSignedUrlPromise("putObject", params);
    res.status(200).json({ url });
  } catch (e) {
    res.status(500).json(e);
  }
};

const listObjects = async (req, res) => {
  const { bucketName } = req;
  const params = {
    Bucket: utils.getBucketNameFromID(bucketName),
    Delimiter: "/",
    Prefix: `${bucketName}/`
  };
  s3.listObjects(params, (err, data) => {
    if (err) res.status(500).json(err);

    const list = data.Contents.map(
      item =>
        `https://${utils.getBucketNameFromID(bucketName)}.s3.amazonaws.com/${
        item.Key
        }`
    );
    res.status(200).json(list);
  });
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndDelete(id).exec();
    const deleteProcess = await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET_VIDEOS,
        Key: video.Key
      })
      .promise();
    res.status(200).json(deleteProcess);
  } catch (e) {
    res.status(500).json(e);
  }
};

module.exports = {
  createVideoRecord,
  appendToVideoFile,
  uploadStreamToS3,
  getPresignedURL,
  deleteVideo,
  getUploadPresignedURL,
  listObjects
};
