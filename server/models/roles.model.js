const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const RoleSchema = new mongoose.Schema({
  name: {
    type: String
  }
})

module.exports = mongoose.model('Role', RoleSchema)
