const spawn = require("child_process").spawn,
  config = require("../config/default"),
  cmd = config.rtmp_server.trans.ffmpeg;

const fs = require("fs");
const crypto = require("crypto");
const live_service = process.env.LIVE_SERVICE || "localhost";
const generateStreamThumbnail = (stream_key) => {
  const args = [
    "-y",
    "-i",
    `http://${live_service}:8888/live/` + stream_key + "/index.m3u8",
    "-ss",
    "00:00:01",
    "-vframes",
    "1",
    "-vf",
    "scale=-2:300",
    "./server/thumbnail/" + stream_key + ".png",
  ];
  console.log("Generating thumbnail with args, ", args, " and cmd ", cmd);
  spawn(cmd, args, {
    detached: true,
    stdio: "ignore",
  })
    .on("error", (err) => {
      console.log("Error generating thumbnail", err);
    })
    .on("exit", (code) => {
      console.log("Thumbnail generation exited with code", code);
    });
};

const deleteStreamThumbnail = (stream_key) => {
  const path = "./server/thumbnail/" + stream_key + ".png";
  fs.unlink(path, (err) => {
    if (err) {
      console.log("Error deleting thumbnail", err);
    } else {
      console.log("Thumbnail deleted");
    }
  });
};

module.exports = {
  generateStreamThumbnail: generateStreamThumbnail,
  deleteStreamThumbnail: deleteStreamThumbnail,
};
