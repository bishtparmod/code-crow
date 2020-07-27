const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.Promise = global.Promise;

const SectionSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: [{
    type: String
  }],
  order: {
    type: Number
  },
  side: {
    type: String
  }
})

module.exports = mongoose.model('Section', SectionSchema);
