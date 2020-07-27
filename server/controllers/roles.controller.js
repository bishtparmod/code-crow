const Roles = require('../models/roles.model')
const RoleMapping = require('../models/roleMapping.model')

const addRole = (req, res) => {
  const { name } = req.body

  Roles
    .create({ name })
    .then(role => res.status(200).json(role))
    .catch(err => res.status(500).json(err))
}

const getRoles = (req, res) => {
  Roles
    .find({})
    .then(roles => res.status(200).json(roles))
    .catch(err => res.status(500).json(err))
}

const getUserRoles = async (req, res) => {
  const userId = req.user.id

  RoleMapping
    .findOne({ userId })
    .populate('userId')
    .then(roleMappings => res.status(200).json(roleMappings))
    .catch(err => res.status(500).json(err))
}

const getRoleUsers = (req, res) => {
  const { roleId } = req.params

  RoleMapping
    .find({ roleId })
    .populate('userId')
    .then(roleMappings => res.status(200).json(roleMappings.map(roleMapping => roleMapping.userId)))
    .catch(err => res.status(500).json(err))
}

const addRoleMapping = (req, res) => {
  const { roleId, userId } = req.body

  RoleMapping
    .create({ roleId, userId })
    .then(roleMapping => res.status(200).json(roleMapping))
    .catch(err => res.status(500).json(err))
}

const deleteRoleMapping = (req, res) => {
  const { roleId, userId } = req.body

  RoleMapping
    .findOneAndDelete({ roleId, userId })
    .then(roleMapping => res.status(200).json(roleMapping))
    .catch(err => res.status(500).json(err))
}

module.exports = {
  addRole,
  getRoles,
  getRoleUsers,
  addRoleMapping,
  deleteRoleMapping,
  getUserRoles
}