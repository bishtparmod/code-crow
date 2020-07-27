const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.Promise = global.Promise;

const NotificationsSchema = new mongoose.Schema(
  {
    sentBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sentTo: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: Number,
      enums: [
        0,    //'friend-request-recieved',
        1,    //'friend-request-accepted-sent-by',
        2,    //'friend-request-accepted-sent-to',
        3     //'friend-unread-message-count'
      ]
    },
    seen: {
      type: Boolean,
      default: false
    },
    count: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Notification', NotificationsSchema);
