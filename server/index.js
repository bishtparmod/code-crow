// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
require('./config/mongoose');
const connectionHelper = require('./helpers/online-user.helper')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const videoUploadHelper = require('./helpers/s3.helper')
const FFMPEGHelper = require('./helpers/ffmpeg.helper')
const VideoPart = require('./models/videoPart.model')
const StreamTime = require('./models/streamingTime.model')

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {

  io.on('connection', (socket) => {
    socket.on('connection-data', async data => {
      const connection = await connectionHelper.connected(data._id, socket.id)
      const { firstName, lastName, avatar, email, socketID, _id } = connection
      io.sockets.connected[socket.id].user = { firstName, lastName, avatar, email, socket: socketID, _id }
      io.emit(`user-connected-${connection._id}`, { user: connection })
    })
    socket.on('disconnect', async () => {
      const disconnection = await connectionHelper.disconnected(socket.id)
      if (socket.streamOptions && socket.streamOptions.isLiveStreaming) {
        const { user, ssid } = socket.streamOptions
        FFMPEGHelper.convertFile({ user, ssid })
      }
      if (disconnection) {
        io.emit(`user-disconnected-${disconnection._id}`, { user: disconnection })
      }
    })

    socket.on('friend-request-sent', data => {
      const { recipient, requester } = data
      const recepientConnection = Object.values(io.sockets.connected).map(connection => connection.user).filter(user => !!(user && user._id == recipient))[0]
      if (recepientConnection)
        io.emit(`friend-request-recieved-${recepientConnection.socket}`, { requester })
    })

    socket.on('friend-request-accepted', data => {
      const { recipient, requester } = data
      const requesterConnection = Object.values(io.sockets.connected).map(connection => connection.user).filter(user => !!(user && user._id == requester))[0]

      if (requesterConnection)
        io.emit(`friend-request-accepted-${requesterConnection.socket}`, { recipient })
    })

    socket.on('friend-message-sent', data => {
      const { recipient, requester } = data
      const recepientConnection = Object.values(io.sockets.connected).map(connection => connection.user).filter(user => !!(user && user._id == recipient))[0]
      if (recepientConnection)
        io.emit(`friend-message-recieved-${recepientConnection.socket}`, { requester })
    })

    // Change to Video Part
    socket.on('stream-data-started', async data => {
      const { stream, channel, user, ssid, name } = data
      socket.streamOptions = {
        isLiveStreaming: true,
        stream, channel, user, name
      }
      const video = await videoUploadHelper.createVideoRecord({ stream, channel, user, ssid, name })
      socket.emit('video-part', video)
      console.log('>> EMITTED VIDEO PART', video.id, new Date())
      socket.streamOptions.video = video.id
    })

    socket.on('stream-data-ended', data => {
      delete socket.streamOptions
    })

    // upload file event
    socket.on('upload-video-part', async data => {
      const { ssid } = data
      try {
        if (socket.streamOptions && socket.streamOptions.isLiveStreaming) {
          const { stream, channel, user } = socket.streamOptions
          const upload = await videoUploadHelper.uploadStreamToS3({ stream, channel, user, ssid })
          socket.emit(`upload-finished-${ssid}`, upload)
        } else {
          const videoPart = await VideoPart.findOne({ ssid }).exec()
          const { stream, channel, user } = videoPart
          const upload = await videoUploadHelper.uploadStreamToS3({ stream, channel, user, ssid })
          socket.emit(`upload-finished-${ssid}`, upload)
        }
      } catch (e) {
        console.log(e)
      }
    })

    socket.on('process-video-part', async data => {
      const { ssid } = data
      const { _id } = io.sockets.connected[socket.id].user
      const processVideoPart = await FFMPEGHelper.processVideoPart({ ssid, user: _id })
      socket.emit(`process-video-part-${ssid}-completed`, processVideoPart)
    })

    socket.on('convert-video-part', async data => {
      const { ssid } = data
      const { user } = socket.streamOptions
      try {
        const conversion = await FFMPEGHelper.convertFile({ user, ssid })
        if (conversion)
          socket.emit(`process-video-part-${ssid}-completed`, { conversion })
      } catch (e) {
        console.log(e)
      }
    })

    // Change to Video Part
    socket.on('stream-data-available', async data => {
      const { buffer, ssid } = data
      socket.streamOptions.ssid = ssid
      const { stream, channel, user } = socket.streamOptions
      videoUploadHelper.appendToVideoFile({ buffer, stream, channel, user, ssid })
    })

    socket.on('update-remaining-time', async ({ id }) => {
      await StreamTime.findByIdAndUpdate(id, { $inc: { usedMinutes: 1, remainingMinutes: -1 } }).exec()
    })

    socket.on('channel-added', () => {
      io.emit('channel-added-confirm')
    })

    socket.on('channel-removed', () => {
      io.emit('channel-removed-confirm')
    })

    socket.on('maintenance-mode', data => {
      io.emit(`maintenance-mode`, { data })
    })
  })

  http.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`);
  });
}

module.exports = app;
