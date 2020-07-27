const MaintenanceMode = require('../models/maintenanceMode.model')

const getMaintenanceMode = async (req, res) => {
  try {
    const maintenanceMode = await MaintenanceMode.findOne({}).exec()
    res.status(200).json(maintenanceMode)
  } catch (e) {
    res.status(500).json(e)
  }
}

const setMaintenanceMode = async (req, res) => {
  try {
    const { createUpdateType, isEnabled, message } = req.body
    var maintenanceMode;
    if(createUpdateType == 0) {
      maintenanceMode = await MaintenanceMode.create({ id: 0, isEnabled, message })
    } else {
      maintenanceMode = await MaintenanceMode.updateOne({ id: 0}, { $set: { isEnabled, message }}).exec()
    }
    res.status(200).json(maintenanceMode)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

module.exports = {
  getMaintenanceMode,
  setMaintenanceMode
}