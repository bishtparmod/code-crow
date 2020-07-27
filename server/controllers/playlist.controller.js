const Playlist = require('../models/playlist.model')
const Video = require('../models/video.model')

const getPlayLists = async (req, res) => {
  try {
    const { skip, limit, me } = req.query
    const query = me == '1' ? { user: req.user.id, status: true } : { status: true }
    const playlists = await Playlist
      .find(query)
      .populate({
        path: 'videos',
        populate: [
          {
            path: 'views',
            select: { viewCounter: 1, id: 1 }
          }
        ]
      })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec()
    res.status(200).json(playlists)
  } catch (e) {
    res.status(500).json(e)
  }
}

const getPlayList = async (req, res) => {
  try {
    const { id } = req.params
    const playlist = await Playlist
      .findById(id)
      .populate({
        path: 'videos',
        populate: [
          { path: 'likes', populate: { path: 'user', select: { firstName: 1, id: 1, email: 1, avatar: 1 } } },
          { path: 'views', populate: { path: 'user', select: { firstName: 1, id: 1, email: 1, avatar: 1 } } },
          { path: 'stream', select: { id: 1, title: 1 } },
          { path: 'channel', select: { id: 1, title: 1 } }
        ]
      })
      .exec()
    res.status(200).json(playlist)
  } catch (e) {
    res.status(500).json(e)
  }
}

const createPlaylist = async (req, res) => {
  try {
    const { title, description, status } = req.body
    const playlist = await Playlist.create({ title, description, status, user: req.user.id })
    res.status(200).json(playlist)
  } catch (e) {
    res.status(500).json(e)
  }
}

const addVideo = async (req, res) => {
  try {
    const { id, fk } = req.params
    const playlist = await Playlist.findByIdAndUpdate(id, { $push: { videos: fk } }, { new: true }).exec()
    await Video.findByIdAndUpdate(fk, { $set: { playlist: id } }).exec()
    res.status(200).json(playlist)
  } catch (e) {
    res.status(500).json(e)
  }
}

const removeVideo = async (req, res) => {
  try {
    const { id, fk } = req.params
    const playlist = await Playlist.findByIdAndUpdate(id, { $pull: { videos: fk } }, { new: true }).exec()
    await Video.findByIdAndUpdate(fk, { $set: { playlist: null } }).exec()
    res.status(200).json(playlist)
  } catch (e) {
    res.status(500).json(e)
  }
}

const updatePlayList = async (req, res) => {
  try {
    const { title, description, status } = req.body
    const { id } = req.params
    const playlist = await Playlist.findByIdAndUpdate(id, { title, description, status }).exec()
    res.status(200).json(playlist)
  } catch (e) {
    res.status(500).json(e)
  }
}

const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params
    const playlist = await Playlist.findByIdAndRemove(id).exec()
    await Video.updateMany({ id: { $in: playlist.videos } }, { playlist: null }).exec()
    res.status(200).send(true)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports = {
  getPlayLists,
  getPlayList,
  createPlaylist,
  addVideo,
  removeVideo,
  updatePlayList,
  deletePlaylist
}