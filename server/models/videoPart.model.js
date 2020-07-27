const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const VideoPartSchema = new mongoose.Schema({
  stream: { type: Schema.Types.ObjectId, ref: 'liveStreaming', required: true },
  channel: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: {
    type: String
  },
  deleteDate: {
    type: Date
  },
  isConverting: {
    type: Boolean,
    default: false
  },
  isConverted: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number
  },
  Location: {
    type: String
  },
  ssid: {
    type: String
  },
  Key: {
    type: String
  },
  tempLocation: {
    type: String
  },
  isInProgress: {
    type: Boolean,
    default: false
  },
  isUploading: {
    type: Boolean,
    default: false
  },
  isUploaded: {
    type: Boolean,
    default: false
  },
  isPersonal: {
    type: Boolean
  },
  thumbnail: {
    type: {
      Location: { type: String },
      Key: { type: String }
    }
  },
  size: {
    type: Number
  },
  status: { type: Boolean }
}, {
  timestamps: true
});

module.exports = mongoose.model('VideoPart', VideoPartSchema);
