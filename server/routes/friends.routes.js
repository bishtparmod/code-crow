const express = require('express')
const router = express.Router()
const friendsCTRL = require('../controllers/friends.controller')
const notificationsCTRL = require('../controllers/notifications.controller')

module.exports = router

router.get('/', friendsCTRL.getFriendList)
router.post('/add-friend', friendsCTRL.sendFriendRequest, notificationsCTRL.friendRequestSentNotification)
router.patch('/accept-request', friendsCTRL.acceptFriendRequest, friendsCTRL.linkFriendChannel, notificationsCTRL.friendRequestAcceptedNotification)
router.patch('/decline-request', friendsCTRL.declineFriendRequest)
router.patch('/cancel-request', friendsCTRL.cancelFriendRequest)
router.patch('/block-user', friendsCTRL.blockUser)
router.patch('/unblock-user', friendsCTRL.unBlockUser)
router.patch('/update-sid', friendsCTRL.linkFriendChannel)
router.patch('/update-seen-index', friendsCTRL.updateLastSeenMessageIndex)