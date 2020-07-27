const LiveStreaming = require('../models/liveStreaming.model')
const Channel = require('../models/channel.model')

const uploadVideoPart = async (req, res) => {

}

const deleteVideoPart = async (req, res) => {

}

const getLiveStreams = async (req, res) => {
  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  LiveStreaming
    .find({
      startDate: {
        $gte: firstDay, $lte: lastDay
      }
    })
    .exec()
    .then(liveStreams => res.status(200).json(liveStreams))
    .catch(e => res.status(500).json(e))
}

const getMyLiveStreams = (req, res) => {
  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  LiveStreaming
    .find({
      startDate: {
        $gte: firstDay, $lte: lastDay
      },
      user: req.user.id
    })
    .exec()
    .then(liveStreams => res.status(200).json(liveStreams))
    .catch(e => res.status(500).json(e))
}

const createLiveStreaming = async (req, res) => {
  try {
    const { channelSid, title } = req.body
    const startDate = new Date()
    const channelSidRegex = new RegExp("^" + channelSid, "i");
    const channel = await Channel.findOneAndUpdate({ channelSID: channelSidRegex }, { lastStreamTimestamp: startDate }, { new: true }).exec()
    const liveStreaming = await LiveStreaming.create({ channel: channel.id, startDate, participants: [], title, user: req.user.id })
    res.status(200).json(liveStreaming)
  } catch (e) {
    res.status(500).json(e)
  }
}

const addParticipant = async (req, res) => {
  try {
    const { id } = req.params
    const { startDate, username } = req.body
    const participant = { startDate, username }
    const update = await LiveStreaming.findByIdAndUpdate(id, { $push: { participants: participant } }, { new: true }).exec()
    res.status(200).json(update)
  } catch (e) {
    res.status(500).json(e)
  }
}

const rateStream = async (req, res) => {
  try {
    const { rate, username } = req.body
    const { id } = req.params
    const liveStream = await LiveStreaming.findById(id)
    const participant = liveStream.participants.filter(participant => participant.username == username ? true : false)[0]
    participant.rate = rate
    const participants = liveStream.participants.filter(participant => participant.username == username ? false : true)
    participants.push(participant)
    const update = await LiveStreaming.findByIdAndUpdate(id, { participants })
    res.status(200).json(update)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

const endParticipant = async (req, res) => {
  try {
    const { username } = req.body
    const endDate = new Date()
    const { id } = req.params
    const liveStream = await LiveStreaming.findById(id)
    const participant = liveStream.participants.filter(participant => participant.username == username ? true : false)[0]
    const { startDate } = participant
    participant.endDate = endDate
    participant.duration = (endDate.getTime() - new Date(startDate).getTime()) / 1000
    const participants = liveStream.participants.filter(participant => participant.username == username ? false : true)
    participants.push(participant)
    const update = await LiveStreaming.findByIdAndUpdate(id, { participants })
    res.status(200).json(update)
  } catch (e) {
    res.status(500).json(e)
  }
}

const endLiveStream = async (req, res) => {
  try {
    const { id } = req.params
    const endDate = new Date()
    const liveStream = await LiveStreaming.findById(id).exec()
    const startDate = new Date(liveStream.startDate)
    const duration = (endDate.getTime() - startDate.getTime()) / 1000
    const update = await LiveStreaming.findByIdAndUpdate(id, { endDate, duration }, { new: true }).exec()
    res.status(200).json(update)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports = {
  createLiveStreaming,
  addParticipant,
  endLiveStream,
  getLiveStreams,
  rateStream,
  endParticipant,
  getMyLiveStreams
}