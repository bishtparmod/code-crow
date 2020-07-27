const User = require("../models/user.model");
const Friends = require("../models/friends.model");

const sendFriendRequest = async (req, res, next) => {
  try {
    const requester = req.user.id;
    const { recipient } = req.body;

    const requesterDocument = await Friends.create({
      requester,
      recipient,
      status: 1
    });
    const recipientDocument = await Friends.create({
      requester,
      recipient,
      status: 2
    });

    const updateRequester = await User.findByIdAndUpdate(requester, {
      $push: { friends: requesterDocument.id }
    });
    const updateRecipient = await User.findByIdAndUpdate(recipient, {
      $push: { friends: recipientDocument.id }
    });

    req.globals = requesterDocument;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const acceptFriendRequest = async (req, res, next) => {
  try {
    const recipient = req.user.id;
    const { requester } = req.body;

    const update = await Friends.updateMany(
      { recipient, requester },
      { $set: { status: 3 } }
    );

    req.globals = update;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const declineFriendRequest = async (req, res) => {
  try {
    const recipient = req.user.id;
    const { requester } = req.body;

    const requesterDocument = await Friends.findOneAndRemove({
      recipient,
      requester
    });
    const recipientDocument = await Friends.findOneAndRemove({
      recipient,
      requester
    });

    const updateRequester = await User.findByIdAndUpdate(requester, {
      $pull: { friends: requesterDocument.id }
    });
    const updateRecipient = await User.findByIdAndUpdate(recipient, {
      $pull: { friends: recipientDocument.id }
    });

    res.status(200).json(recipientDocument);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const cancelFriendRequest = async (req, res) => {
  try {
    const requester = req.user.id;
    const { recipient } = req.body;

    const requesterDocument = await Friends.findOneAndRemove({
      recipient,
      requester
    });
    const recipientDocument = await Friends.findOneAndRemove({
      recipient,
      requester
    });

    const updateRequester = await User.findByIdAndUpdate(requester, {
      $pull: { friends: requesterDocument.id }
    });
    const updateRecipient = await User.findByIdAndUpdate(recipient, {
      $pull: { friends: recipientDocument.id }
    });

    res.status(200).json(recipientDocument);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const blockUser = async (req, res) => {
  try {
    const requester = req.user.id;
    const { recipient } = req.body;

    const update = await Friends.findOneAndUpdate(
      { recipient, requester },
      { $set: { status: 4 } }
    );

    res.status(200).json(update);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const unBlockUser = async (req, res) => {
  try {
    const requester = req.user.id;
    const { recipient } = req.body;

    const update = await Friends.findOneAndUpdate(
      { recipient, requester, status: 4 },
      { $set: { status: 3 } }
    );

    res.status(200).json(update);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const getFriendList = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendList = await User.findById(userId)
      .select(["id", "friends"])
      .populate({
        path: "friends",
        populate: [{ path: "requester" }, { path: "recipient" }]
      });

    res.status(200).json(friendList);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const linkFriendChannel = async (req, res) => {
  try {
    const requester = req.user.id;
    const { recipient, channelSID } = req.body;

    const update = await Friends.updateMany(
      { recipient, requester },
      { $set: { channelSID } }
    );

    res.status(200).json({ update });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const updateLastSeenMessageIndex = async (req, res) => {
  try {
    const requester = req.user.id;
    const { recipient, lastSeenMessageIndex } = req.body;

    const update = await Friends.updateMany(
      { recipient, requester },
      { $set: { lastSeenMessageIndex } }
    );

    res.status(200).json({ update });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  blockUser,
  unBlockUser,
  getFriendList,
  cancelFriendRequest,
  linkFriendChannel,
  updateLastSeenMessageIndex
};
