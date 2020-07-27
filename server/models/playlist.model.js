const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const PlayListSchema = new mongoose.Schema({
  videos: [{ type: Schema.Types.ObjectId, ref: 'Video', required: true }],
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: Boolean, default: true },
  title: { type: String },
  description: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('playlist', PlayListSchema);
