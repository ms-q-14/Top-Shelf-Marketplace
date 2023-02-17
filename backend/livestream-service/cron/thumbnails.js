const CronJob = require("cron").CronJob,
  request = require("request"),
  helpers = require("../helpers/helper"),
  config = require("../config/default"),
  port = config.rtmp_server.http.port;

const job = new CronJob(
  "*/1 * * * *",
  function () {
    console.log("running cron job");
    request.get(
      "http://live-service:" + port + "/api/streams",
      function (error, response, body) {
        if (error) {
          console.log("Error in cron job", error);
        }
        let streams = JSON.parse(body);
        if (typeof (streams["live"] !== undefined)) {
          let live_streams = streams["live"];
          for (let stream in live_streams) {
            if (!live_streams.hasOwnProperty(stream)) continue;
            helpers.generateStreamThumbnail(stream);
          }
        }
      }
    );
  },
  null,
  true
);

module.exports = job;
