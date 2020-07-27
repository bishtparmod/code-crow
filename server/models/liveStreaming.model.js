const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.Promise = global.Promise;

const liveStramingModel = new mongoose.Schema({
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  duration: {
    type: Number,
    default: 0
  },
  participants: {
    type: {
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      },
      duration: {
        type: Number
      },
      username: {
        type: String
      }
    }
  },
  avgParticipantDuration: {
    type: Number
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String
  }
})

liveStramingModel.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
  const self = this
  self.findOne(condition, (err, result) => {
    return result ? callback(err, result) : self.create(condition, (err, result) => { return callback(err, result) })
  })
}

module.exports = mongoose.model('liveStreaming', liveStramingModel);
