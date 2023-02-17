const axios = require("axios");
const NodeMediaServer = require("node-media-server"),
  config = require("./config/default").rtmp_server,
  cmd = config.trans.ffmpeg;
const spawn = require("child_process").spawn;
nms = new NodeMediaServer(config);
const StreamDBService = require("./Services/stream_db.service");
const helpers = require("./helpers/helper");
const thumbnail_generator = require("./cron/thumbnails");

nms.on("prePublish", async (id, StreamPath, args, event) => {
  let stream_key = getStreamKeyFromStreamPath(StreamPath);

  let response;
  try {
    response = await validateStreamKey(stream_key);
    const { _id, username, avatar } = response.user;
    await StreamDBService.createStream(_id, username, avatar);
    let session = nms.getSession(id);
    setTimeout(() => {
      helpers.generateStreamThumbnail(stream_key);
    }, 5000);
    console.log(
      "[NodeEvent on prePublish]",
      `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
    );
  } catch (err) {
    // reject the stream
    console.log("Rejecting stream", err.message);
    let session = nms.getSession(id);
    session.reject();
  }
});

nms.on("postPublish", async (id, StreamPath, args) => {
  try {
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    setTimeout(() => {
      helpers.generateStreamThumbnail(stream_key);
    }, 5000);
    console.log(
      "[NodeEvent on postPublish]!",
      `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
    );
  } catch (err) {
    console.log("Error starting publish");
    console.log(err);
  }
});

nms.on("donePublish", async (id, StreamPath, args) => {
  try {
    let stream_key = getStreamKeyFromStreamPath(StreamPath);
    StreamDBService.deleteStream(stream_key);
    helpers.deleteStreamThumbnail(stream_key);
    console.log(
      "[NodeEvent on donePublish]",
      `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
    );
  } catch (err) {
    console.log(err);
  }
});

const getStreamKeyFromStreamPath = (path) => {
  let parts = path.split("/");
  return parts[parts.length - 1];
};

const validateStreamKey = (key) => {
  const identity_service = process.env.IDENTITY_SERVICE || "localhost";
  return new Promise((resolve, reject) => {
    // use axios to make a request to our auth service
    axios
      .get(`http://${identity_service}:3000/api/user/stream/${key}`)
      .then((res) => {
        if (res.status === 200) {
          return resolve(res.data);
        }
        return reject("Invalid stream key");
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

// // Call start method at the end of file
thumbnail_generator.start();
// console.log(thumbnail_generator);

module.exports = nms;
