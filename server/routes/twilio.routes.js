const express = require("express");
const router = express.Router();
const TokenService = require("../services/tokenService");
const User = require("../models/user.model");

router.post("/chat-token", function(req, res) {
  const { deviceId, identity } = req.body;
  var token = TokenService.generateChatToken(identity, deviceId);

  res.json({ token });
});

router.post("/video-token", function(req, res) {
  const { deviceId, identity } = req.body;
  var token = TokenService.generateVideoToken(identity, deviceId);

  res.json({ token });
});

router.get("/enterChannel/:sid/:email", (req, res) => {
  const { email, sid } = req.params;
  User.findOneAndUpdate({ email }, { channelSID: sid }, { new: true })
    .exec()
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

router.get("/userChannel/:email", (req, res) => {
  const { email } = req.params;
  User.findOne({ email })
    .exec()
    .then(user => res.json({ sid: user.channelSID }))
    .catch(err => res.json(err));
});

module.exports = router;
