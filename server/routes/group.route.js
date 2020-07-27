const express = require("express");
const router = express.Router();
const groupsCTRL = require("../controllers/group.controller");
const notificationsCTRL = require("../controllers/notifications.controller");

module.exports = router;

router.get("/", groupsCTRL.getGroupList);
router.post("/create-group", groupsCTRL.createGroup);
router.post("/getlist", groupsCTRL.getGroupList);
router.patch("/update-sid", groupsCTRL.linkGroupChannel);
