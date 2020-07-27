const Channel = require('../models/channel.model')
const Block = require('../models/blocks.model')
const User = require('../models/user.model')
const LiveStreaming = require('../models/liveStreaming.model')

const createChannel = (req, res) => {
  const { channelSID, title, description, isPrivate, user } = req.body
  Channel
    .create({ channelSID, title, description, isPrivate, user })
    .then(channel => res.status(200).json(channel))
    .catch(err => res.status(500).json(err))
}

const getChannels = (req, res) => {
  Channel
    .find()
    .exec()
    .then(channels => res.status(200).json(channels))
    .catch(err => res.status(500).json(err))
}

const getMyChannels = (req, res) => {
  Channel
    .find({ user: req.user.id })
    .exec()
    .then(channels => res.status(200).json(channels))
    .catch(err => res.status(500).json(err))
}

const getChannelLiveStreams = (req, res) => {
  const { id } = req.params
  LiveStreaming
    .find({ channel: id })
    .exec()
    .then(liveStreams => res.status(200).json(liveStreams))
    .catch(err => res.status(500).json(err))
}

const getChannelRecentLiveStream = (req, res) => {
  const { id } = req.params
  LiveStreaming
    .findOne({ channel: id })
    .sort({ startDate: -1 })
    .exec()
    .then(liveStream => {
      res.status(200).json(liveStream)
    })
    .catch(err => res.status(500).json(err))
}

const getChannel = (req, res) => {
  const { id } = req.params
  const channelSidRegex = new RegExp("^" + id, "i");
  Channel
    .findOne({ channelSID: channelSidRegex })
    .exec()
    .then(async channel => {
      if (channel) {
        const liveStreaming = await LiveStreaming.find({ channel: channel._id })
        res.status(200).json({ channel, liveStreaming })
      } else {
        res.status(401).json({ channel: "Channel not found" })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
}

const getBlockList = (req, res) => {
  const { id } = req.params
  Block
    .find({ channel: id })
    .populate('channel')
    .populate('user')
    .exec()
    .then(blocks => res.status(200).json(blocks))
    .catch(err => res.status(500).json(err))
}

const blockUser = (req, res) => {
  const { user, channel } = req.body
  Block
    .create({ user, channel })
    .then(async $block => {
      try {
        const block = await Block.findById($block.id).populate('channel').populate('user').exec()
        const exitChannel = await User.findByIdAndUpdate(user, { channelSID: null }, { new: true })
        console.log(exitChannel)
        res.status(200).json(block)
      } catch (e) {
        res.status(500).json(err)
      }
    })
    .catch(err => res.status(500).json(err))
}

const unblockUser = (req, res) => {
  const { id } = req.params
  Block
    .findOneAndDelete({ _id: id })
    .exec()
    .then(block => res.status(200).json(block))
    .catch(err => res.status(500).json(err))
}

const isUserBlocked = (req, res) => {
  const { user, channel } = req.params
  Block
    .findOne({ user, channel })
    .exec()
    .then(block => res.status(200).json(block))
    .catch(err => res.status(500).json(err))
}

const updateChannel = (req, res) => {
  const { id } = req.params
  Channel
    .findByIdAndUpdate(id, req.body, { new: true })
    .exec()
    .then(channel => res.status(200).json(channel))
    .catch(err => res.status(500).json(err))
}

const joinOrLeave = async (req, res) => {
  try {
    const { id } = req.user
    const { channelSID } = req.body
    const updateUser = await User.findByIdAndUpdate(id, { channelSID }, { new: true }).exec()
    console.log('>> UPDATED USER', updateUser)
    res.status(200).json(updateUser)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

module.exports = {
  createChannel,
  getChannels,
  getChannel,
  getBlockList,
  blockUser,
  unblockUser,
  isUserBlocked,
  getChannelLiveStreams,
  getChannelRecentLiveStream,
  getMyChannels,
  joinOrLeave
}