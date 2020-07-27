const User = require('../models/user.model');

const connected = (userId, socketID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const connectionUpdate = await User.findByIdAndUpdate(userId, { isOnline: true, socketID }, { new: true })
      resolve(connectionUpdate)
    } catch (e) {
      reject(e)
    }
  })
}

const disconnected = socketID => {
  return new Promise(async (resolve, reject) => {
    try {
      const connectionUpdate = await User.findOneAndUpdate({ socketID }, { isOnline: false, socketID: null }, { new: true })
      resolve(connectionUpdate)
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  connected, disconnected
}