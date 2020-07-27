const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.Promise = global.Promise;

const PageSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true
  },
  sections: [
    { type: Schema.Types.ObjectId, ref: 'Section', required: true }
  ],
  uniqueName: {
    type: String,
    unique: true
  }
})

module.exports = mongoose.model('Page', PageSchema);
