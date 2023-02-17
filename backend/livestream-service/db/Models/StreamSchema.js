const mongoose = require("mongoose");

const StreamSchema = new mongoose.Schema({
  streamKey: {
    type: String,
    required: true,
  },
  streamName: {
    type: String,
    default: "Untitled Stream",
  },
  streamCategory: {
    type: String,
    default: "General",
  },
  streamAvatar: {
    type: String,
    required: true,
  },
  streamerName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Stream", StreamSchema);
