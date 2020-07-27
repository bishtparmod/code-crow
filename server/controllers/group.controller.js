const User = require("../models/user.model");
const Group = require("../models/group.model");

const createGroup = async (req, res, next) => {
  const host = req.user.id;
  const { members } = req.body;
  try {
    const hostDocument = await Group.create({
      host,
      members
    });

    await User.findByIdAndUpdate(host, {
      $push: { groups: hostDocument.id }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const getGroupList = async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const updateLastSeenMessageIndex = async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const linkGroupChannel = async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

module.exports = {
  createGroup,
  getGroupList,
  updateLastSeenMessageIndex,
  linkGroupChannel
};
