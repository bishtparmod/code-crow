const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const RoleMappingSchema = new mongoose.Schema({
  roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('RoleMapping', RoleMappingSchema)
