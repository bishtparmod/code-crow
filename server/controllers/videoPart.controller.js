const VideoPart = require('../models/videoPart.model')
const fs = require('fs')
const path = require('path')
const ffmpegHelper = require("../helpers/ffmpeg.helper");
const util = require('util')

fs.rename = util.promisify(fs.rename)

const unsavedVideoParts = async (req, res) => {
  try {
    const { id } = req.user
    fs.readdir(`./public/temp_videos/${id}`, async (err, files) => {
      if (err) {
        res.status(200).json([])
      } else {
        const fileNames = files.map(file => file.substr(0, file.indexOf('.')))
        const videoParts = await VideoPart
          .find({ ssid: { $in: fileNames } })
          .populate([
            {
              path: 'stream',
              select: { id: 1, title: 1 }
            },
            {
              path: 'channel',
              select: { id: 1, title: 1 }
            }
          ])
          .exec()
        res.status(200).json(videoParts)
      }
    });
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

const downloadVideoPart = async (req, res) => {
  const { ssid } = req.params
  const { id } = req.user
  const filePath = `public/temp_videos/${id}/${ssid}.mp4`
  res.download(filePath)
}

const deleteVideoPart = async (req, res) => {
  try {
    const { ssid } = req.params
    const { id } = req.user
    fs.unlinkSync(`public/temp_videos/${id}/${ssid}.mp4`)
    await VideoPart.findOneAndDelete({ ssid }).exec()
    res.status(200).json({ count: 1 })
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

const playVideoPart = async (req, res) => {
  const { ssid } = req.params
  const { id } = req.user
  const { range } = req.headers
  try {
    const path = `public/temp_videos/${id}/${ssid}.mp4`
    const state = fs.statSync(path)
    const fileSize = state.size
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = (end - start) + 1
      const file = fs.createReadStream(path, { start, end })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head)
      file.pipe(res)
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

const updateVideoPart = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const videoPart = await VideoPart.findByIdAndUpdate(id, { name }).exec()
    res.status(200).json(videoPart)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

module.exports = {
  unsavedVideoParts,
  downloadVideoPart,
  deleteVideoPart,
  playVideoPart,
  updateVideoPart
}