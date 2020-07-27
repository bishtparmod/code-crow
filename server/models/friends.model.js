const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.Promise = global.Promise;

const FriendRequest = new mongoose.Schema(
  {
    requester: { type: Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: Number,
      enums: [
        0,    //'add friend',
        1,    //'requested',
        2,    //'pending',
        3,    //'friends',
        4,    //'blocked'
      ]
    },
    channelSID: {type: String},
    lastSeenMessageIndex: {type: Number}
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Friends', FriendRequest);
