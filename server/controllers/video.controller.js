const Video = require('../models/video.model')
const VideoViews = require('../models/videoViews.model')
const VideoLike = require('../models/videoLikes.model')
const VideoComment = require('../models/videoComments.model')
const LiveStream = require('../models/liveStreaming.model')
const Channel = require('../models/channel.model')
const User = require('../models/user.model')
const { promisify } = require('util')
const AmazonS3URI = require('amazon-s3-uri')

LiveStream.findOneOrCreate = promisify(LiveStream.findOneOrCreate)
Channel.findOneOrCreate = promisify(Channel.findOneOrCreate)


const getVideos = async (req, res) => {
  try {
    const { skip, limit, me, admin, name, sort } = req.query
    const query = me == '1' ? { user: req.user.id } : admin == '1' ? {} : { status: true }

    if (name)
      query.title = { $regex: new RegExp(name, 'ig') }

    Promise.all([
      Video
        .find(query)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort(sort)
        .populate([
          { path: 'user', select: { id: 1, firstName: 1 } },
          { path: 'stream', select: { title: 1, id: 1, duration: 1 } },
          { path: 'channel', select: { title: 1, id: 1 } },
          { path: 'views', populate: { path: 'user', select: { firstName: 1, lastName: 1, id: 1, providerType: 1, avatar: 1, email: 1 } } },
          { path: 'likes' }
        ])
        .exec(),
      Video
        .find(query).count()
    ]).then(([videos, count]) => {
      res.status(200).json({ videos, count })
    })

  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

const getAllVideos = async (req, res) => {
  try {
    const { skip, limit, me, admin } = req.query
    const query = me == '1' ? { user: req.user.id } : admin == '1' ? {} : { status: true }
    const { name } = req.query
    if (name)
      query.title = { $regex: new RegExp(name, 'ig') }
    const videos = await Video
      .find(query)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ isPersonal: -1 })
      .populate([
        { path: 'user', select: { id: 1, firstName: 1 } },
        { path: 'stream', select: { title: 1, id: 1, duration: 1 } },
        { path: 'channel', select: { title: 1, id: 1 } },
        { path: 'views', populate: { path: 'user', select: { firstName: 1, lastName: 1, id: 1, providerType: 1, avatar: 1, email: 1 } } },
        { path: 'likes' }
      ])
      .exec()

    res.status(200).json(videos)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

const createVideoFromURL = async (req, res) => {
  const { url, title, duration, thumbnail } = req.body
  const userId = req.user.id
  const channelCondition = { user: userId, isPrivate: true, title: "General Uploads", channelSID: "General Uploads" }
  const streamCondition = { user: userId, title, duration }
  try {
    const channel = await Channel.findOneAndUpdate({ user: userId, title: "General Uploads" }, channelCondition, { upsert: true, new: true }).exec()
    const stream = await LiveStream.findOneAndUpdate({ user: userId, title }, streamCondition, { upsert: true, new: true }).exec()
    const key = `${AmazonS3URI(url).key.substr(0, AmazonS3URI(url).key.indexOf('?'))}`
    const video = await Video.create({
      user: userId,
      channel: channel.id,
      stream: stream.id,
      isUploading: false,
      isUploaded: true,
      title,
      duration,
      status: true,
      isInProgress: false,
      Key: key.substr(0, url.indexOf('?')),
      Location: url,
      views: [], likes: [], comments: [],
      thumbnail
    })
    res.status(200).json(video)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

const getVideo = async (req, res) => {
  const { id } = req.params
  try {
    const video = await Video
      .findById(id)
      .populate([
        'stream',
        'channel',
        'user',
        'likes',
        {
          path: 'comments',
          populate: {
            path: 'user',
            select: { id: 1, firstName: 1, avatar: 1 }
          }
        },
        {
          path: 'views',
          select: { viewsTimestamps: 0, createdAt: 0, updatedAt: 0, video: 0 },
          populate: {
            path: 'user',
            select: { id: 1, firstName: 1, email: 1 }
          }
        },
        {
          path: 'playlist',
          populate: {
            path: 'videos',
            populate: [
              {
                path: 'stream',
                select: { id: 1, title: 1, duration: 1 }
              },
              {
                path: 'channel',
                select: { id: 1, title: 1 }
              }
            ]
          }
        }
      ])
      .exec()
    res.status(200).json(video)
  } catch (e) {
    res.status(500).json(e)
  }
}

const likeVideo = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const { status } = req.body
  try {
    const videoLike = await VideoLike.findOneAndUpdate({ user: userId, video: id }, { status }, { upsert: true, new: true }).exec()
    const video = await Video.findById(id)
    if (video.likes.indexOf(videoLike.id) == -1) {
      video.likes = [...video.likes, videoLike.id]
      video.save()
    }
    res.status(200).json({ status })
  } catch (e) {
    res.status(500).json(e)
  }
}

const addComment = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const { body } = req.body
  try {
    const $comment = await VideoComment.create({ video: id, user: userId, body })
    const user = await User.findById(userId, { id: 1, firstName: 1, avatar: 1 }).exec()
    await Video.findByIdAndUpdate(id, { $push: { comments: $comment.id } }).exec()
    res.status(200).json({ user, body, createdAt: new Date() })
  } catch (e) {
    res.status(500).json(e)
  }
}

const toggleVideoActivation = async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  try {
    const updateVideo = await Video.findByIdAndUpdate(id, { status }, { new: true }).exec()
    res.status(200).json(updateVideo)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports = {
  getVideo,
  getVideos,
  getAllVideos,
  likeVideo,
  addComment,
  toggleVideoActivation,
  createVideoFromURL
}
