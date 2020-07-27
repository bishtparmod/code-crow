const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const LegalDocSchema = new mongoose.Schema({
  title: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  pdf: {
    type: String
  }
},
  {
    timestamps: true
  }
)

module.exports = mongoose.model('LegalDoc', LegalDocSchema);
