const mkdirp = require('mkdirp')
const extractFrames = require('ffmpeg-extract-frames')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const VideoPart = require('../models/videoPart.model')
const { getVideoDurationInSeconds } = require('get-video-duration')

const convertFile = ({ user, ssid }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const videoPart = await VideoPart.findOneAndUpdate({ ssid }, { isConverting: true, isInProgress: false }, { new: true }).exec()
      ffmpeg(fs.createReadStream(`public/temp_videos/${user}/${ssid}.webm`))
        .outputFormat('mp4')
        .saveToFile(`public/temp_videos/${user}/${ssid}.mp4`, (stdout, stderr) => {
          console.log('file has been converted succesfully')
        })
        .on('error', err => {
          console.log('Error converting', err)
          return reject(err)
        })
        .on('progress', (progress) => {
          console.log('Processing: ' + progress.targetSize + ' KB converted');
        })
        .on('end', async _ => {
          fs.unlinkSync(`public/temp_videos/${user}/${ssid}.webm`)
          const stream = fs.createReadStream(`public/temp_videos/${user}/${ssid}.mp4`)
          getVideoDurationInSeconds(stream).then(async (duration) => {
            const stats = fs.statSync(`public/temp_videos/${user}/${ssid}.mp4`)
            const size = stats.size / 1000000.0
            await videoPart.update({ isConverting: false, isConverted: true, duration: Math.floor(duration), size }).exec()
            stream.close()
          })
          stream.on('close', async _ => {
            const thumbnail = await extractVideoThumbnail({ user, ssid })
            const imgArrayBuffer = fs.readFileSync(thumbnail)
            await VideoPart.findOneAndUpdate({ ssid }, { thumbnail }, { new: true }).exec()
            resolve({ thumbnail: imgArrayBuffer })
          })
        })
    } catch (e) {
      console.log(e)
      reject(true)
    }
  })
}

const processVideoPart = ({ ssid, user }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const videoPart = await VideoPart.findOne({ ssid })
      const { tempLocation } = videoPart
      const isConverted = !fs.existsSync(tempLocation) && fs.existsSync(tempLocation.replace('.webm', '.mp4'))
      if (isConverted) {
        const stream = fs.createReadStream(tempLocation.replace('.webm', '.mp4'))
        getVideoDurationInSeconds(stream).then(async (duration) => {
          const stats = fs.statSync(tempLocation.replace('.webm', '.mp4'))
          const size = stats.size / 1000000.0
          await videoPart.update({ isConverting: false, isConverted: true, duration: Math.floor(duration), size, isInProgress: false })
          stream.close()
        })
        stream.on('close', async _ => {
          const thumbnail = await extractVideoThumbnail({ user, ssid })
          const update = await VideoPart.findOneAndUpdate({ ssid }, { thumbnail }, { new: true }).exec()
          resolve(update)
        })
      } else {
        return convertFile({ user, ssid })
      }
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

const extractVideoThumbnail = ({ user, ssid }) => {
  return new Promise((resolve, reject) => {
    extractFrames({
      input: `public/temp_videos/${user}/${ssid}.mp4`,
      output: `public/temp_videos/${user}/${ssid}.jpg`,
      offsets: [
        3000
      ]
    })
      .then(async frame => {
        resolve(`public/temp_videos/${user}/${ssid}.jpg`)
      })
      .catch(async e => {
        resolve(false)
      })
  })

}

module.exports = {
  convertFile,
  extractVideoThumbnail,
  processVideoPart
}