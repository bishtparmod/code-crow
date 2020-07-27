const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const GroupSchema = new mongoose.Schema(
  {
    host: { type: Schema.Types.ObjectId, ref: "User" },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    channelSID: { type: String },
    lastSeenMessageIndex: { type: Number }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Group", GroupSchema);
