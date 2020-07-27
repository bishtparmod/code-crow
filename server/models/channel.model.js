const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.Promise = global.Promise;

const ChannelSchema = new mongoose.Schema({
  channelSID: {
    type: String,
    required: true,
    index: false
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  isPrivate: {
    type: Boolean,
    required: true
  },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lastStreamTimestamp: {
    type: Date
  }
})

ChannelSchema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
  const self = this
  self.findOne(condition, (err, result) => {
    return result ? callback(err, result) : self.create(condition, (err, result) => { return callback(err, result) })
  })
}

module.exports = mongoose.model('Channel', ChannelSchema);
