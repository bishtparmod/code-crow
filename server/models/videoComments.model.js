const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const VideoCommentsSchema = new mongoose.Schema({
  video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('VideoComments', VideoCommentsSchema);
