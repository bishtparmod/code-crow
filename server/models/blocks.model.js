const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.Promise = global.Promise;

const BlockSchema = new mongoose.Schema(
  {
    channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Block', BlockSchema);
