const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const VideoLikesSchema = new mongoose.Schema({
  video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: Boolean }
}, {
  timestamps: true
});

module.exports = mongoose.model('VideoLikes', VideoLikesSchema);
