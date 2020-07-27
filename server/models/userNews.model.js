const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const UserNewsSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  news: { type: Schema.Types.ObjectId, ref: 'News', required: true },
  isSeen: { type: Boolean, default: false }
},
  {
    timestamps: true
  }
)

module.exports = mongoose.model('userNews', UserNewsSchema)
