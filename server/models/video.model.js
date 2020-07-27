const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const VideoSchema = new mongoose.Schema({
  stream: { type: Schema.Types.ObjectId, ref: 'liveStreaming', required: true },
  channel: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  views: [{ type: Schema.Types.ObjectId, ref: 'VideoViews', default: [] }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'VideoLikes', default: [] }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'VideoComments', default: [] }],
  playlist: { type: Schema.Types.ObjectId, ref: 'playlist' },
  Location: {
    type: String
  },
  duration: {
    type: Number
  },
  title: {
    type: String
  },
  Key: {
    type: String
  },
  tempLocation: {
    type: String
  },
  isInProgress: {
    type: Boolean
  },
  isUploading: {
    type: Boolean
  },
  isUploaded: {
    type: Boolean
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
  status: { type: Boolean }
}, {
  timestamps: true
});

// text index for text query in room
VideoSchema
  .index({
    Location: 'text',
    Key: 'text'
  }, {
    Location: 'video text index',
    weights: {
      Location: 10,
      Key: 6
  }});

module.exports = mongoose.model('Video', VideoSchema);
