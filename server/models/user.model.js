const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
  friends: [{ type: Schema.Types.ObjectId, ref: "Friends" }],
  groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
  isOnline: { type: Boolean },
  socketID: { type: String },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email"
    ]
  },
  providerType: {
    type: String,
    required: true
  },
  channelId: {
    type: String
  },
  state: {
    type: String
  },
  avatar: {
    type: String
  },
  token: {
    type: String
  },
  notificationObject: {
    type: Object
  },
  channelSID: {
    type: String
  },
  tierType: {
    type: Number // 0 (free), 1 (pro), 2 (developer)
  },
  customerId: {
    type: String
  },
  subscription: {
    type: Object
  },
  isBanned: {
    type: Boolean,
    default: false
  }
});

UserSchema.statics.upsertBitbuketUser = function(
  accessToken,
  refreshToken,
  profile,
  cb
) {
  var that = this;
  return this.findOne(
    {
      email: profile.emails[0].value
    },
    function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
        var newUser = new that({
          firstName: profile.username,
          lastName: profile.username,
          email: profile.emails[0].value,
          providerType: "bitbucket",
          channelId: "",
          state: "",
          token: accessToken
        });

        newUser.save(function(error, savedUser) {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser);
        });
      } else {
        return cb(err, user);
      }
    }
  );
};

module.exports = mongoose.model("User", UserSchema);
