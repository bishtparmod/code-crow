const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.Promise = global.Promise;

const streamingMinutes = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  purchasedMinutes: { type: Number },
  usedMinutes: { type: Number, default: 0 },
  remainingMinutes: { type: Number },
  productId: { type: String },
  chargeId: { type: String }
}, {
  timestamps: true
})

module.exports = mongoose.model('StreamingMinutes', streamingMinutes);
