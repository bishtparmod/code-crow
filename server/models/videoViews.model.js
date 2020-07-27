const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const VideoViewsSchema = new mongoose.Schema({
  video: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  viewsTimestamps: [{
    date: { type: Date },
    duration: { type: Number }
  }],
  viewCounter: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('VideoViews', VideoViewsSchema);
