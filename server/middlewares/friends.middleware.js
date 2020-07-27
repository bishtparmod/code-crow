const User = require('../models/user.model')
const Friends = require('../models/friends.model')

const hasSentRequest = async (req, res, next) => {
  try {
    
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

const areUsersFriends = async (req, res, next) => {
  try {

  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

const areUsersBlocked = async (req, res, next) => {
  try {

  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

const isBlockedFromSendingRequests = async (req, res, next) => {
  try {

  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

module.exports = {
  hasSentRequest,
  areUsersFriends,
  areUsersBlocked,
  isBlockedFromSendingRequests
}