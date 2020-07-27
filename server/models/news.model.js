const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.Promise = global.Promise;

const NewsSchema = new mongoose.Schema({
  title: {
    type: String
  },
  body: {
    type: String
  },
  detail: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  thumbnail: {
    type: String
  },
  image: {
    type: String
  },
  totalViews: {
    type: Number,
    default: 0
  }
},
  {
    timestamps: true
  }
)

module.exports = mongoose.model('News', NewsSchema);
