const webpush = require('web-push')
const Users = require('../models/user.model')
const Notifications = require('../models/notifications.model')

const vapidKeys = {
  publicKey: "BCAHVGlRZxDTLfMNDB4H6J9VrDwovTMaJe1d9PPD648Hc0_eP8og9hLHp8dCKdnjhOz3h3sS6MoUXd8rrX60Nvw",
  privateKey: "FNs0G_yG0D2gjIZsrcsICjaiTzp1FsWn2Y6hI7gFOCs"
}

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

const sendNotification = async (req, res) => {

  try {
    const { title, body, userNames } = req.body

    const $users = await Users.find({ firstName: { $in: userNames } })
    const users = $users.filter(user => user.notificationObject ? true : false)

    const notificationPayload = {
      notification: {
        title: title,
        body: body,
        icon: "assets/main-page-logo-small-hat.png",
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        },
        actions: [{
          action: "explore",
          title: "Go to the site"
        }]
      }
    }

    Promise
      .all(users.map(user => webpush.sendNotification(
        user.notificationObject, JSON.stringify(notificationPayload)
      )))
      .then(() => res.status(200).json({ message: "Notification Sent" }))
      .catch(err => {
        console.error("Error sending notification, reason: ", err);
        res.sendStatus(500);
      })
  } catch (e) {
    console.error("Error sending notification, reason: ", err);
    res.sendStatus(500);
  }
}

const friendRequestSentNotification = async (req, res) => {
  try {
    const requester = req.user.id
    const { recipient } = req.body
    const notification = await Notifications.create({ sentTo: recipient, sentBy: requester, type: 0 })

    res.status(200).json(req.globals)
  } catch (e) {
    res.status(500).json(e)
  }
}

const friendRequestAcceptedNotification = async (req, res) => {
  try {
    const recipient = req.user.id
    const { requester } = req.body

    await Notifications.deleteOne({ sentTo: recipient, sentBy: requester, type: 0 })
    await Notifications.create({ sentTo: requester, sentBy: recipient, type: 1 })
    await Notifications.create({ sentTo: recipient, sentBy: requester, type: 2 })

    res.status(200).json(req.globals)
  } catch (e) {
    res.status(500).json(e)
  }
}

const markNotificationSeen = async (req, res) => {
  const { id } = req.params
  try {
    const notification = await Notifications.findByIdAndUpdate(id, { $set: { seen: true } }, { new: true })
    res.status(200).json(notification)
  } catch (e) {
    res.status(500).json(e)
  }
}

const getUserNotifications = async (req, res) => {
  const { id } = req.user
  try {
    const notifications = await Notifications.find({ sentTo: id }).populate('sentBy').exec()
    res.status(200).json(notifications)
  } catch (e) {
    res.status(500).json(e)
  }
}

const setUnreadMessageCount = async (req, res) => {
  const { requester, recipient,  count } = req.body
  let sentTo = recipient
  let sentBy = requester
  
  try {
    let existingCount = 0
    const noti = await Notifications.findOne({ sentTo, sentBy, type: 3 }).exec()
    if (noti) {
      existingCount = noti.count
    }
    let totalCount = existingCount + parseInt(count)
    if (count === 0) {
      totalCount = 0
    }

    const notification = await Notifications.findOneAndUpdate(
      { sentTo, sentBy, type: 3 },
      { $set: {
        sentTo, sentBy, type: 3,
        count: totalCount
      } }, { upsert: true })
    res.status(200).json(notification)
  } catch (e) {
    res.status(500).json(e)
  }
}

const markReadMessageCount = async (req, res) => {
  const { id } = req.user
  let sentTo = id
  try {
    const notification = await Notifications.updateMany({ sentTo, type: 3 }, { count : 0, seen: true }).exec()
    res.status(200).json(notification)
  } catch (e) {
    res.status(500).json(e)
  }
}

const getUnreadMessageCount = async (req, res) => {
  const { id } = req.user
  try {
    const notifications = await Notifications.find({ sentTo: id, type: 3 }).populate('sentBy').exec()
    res.status(200).json(notifications)
  } catch (e) {
    res.status(500).json(e)
  }
}

module.exports = {
  sendNotification,
  friendRequestSentNotification,
  friendRequestAcceptedNotification,
  markNotificationSeen,
  getUserNotifications,
  setUnreadMessageCount,
  getUnreadMessageCount,
  markReadMessageCount
}
