const express = require('express');
const notificationsCtrl = require('../controllers/notifications.controller');

const router = express.Router();

module.exports = router

router.post('/push', notificationsCtrl.sendNotification)
router.patch('/:id/seen', notificationsCtrl.markNotificationSeen)
router.get('/me', notificationsCtrl.getUserNotifications)
router.get('/unread-message-count', notificationsCtrl.getUnreadMessageCount)
router.post('/unread-message-count', notificationsCtrl.setUnreadMessageCount)
router.get('/mark-read-message-count', notificationsCtrl.markReadMessageCount)

