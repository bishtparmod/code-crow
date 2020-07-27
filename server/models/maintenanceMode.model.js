const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const MaintenanceModeSchema = new mongoose.Schema({
  id: { type: Number },
  isEnabled: { type: Boolean, required: true },
  message: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('MaintenanceMode', MaintenanceModeSchema);
