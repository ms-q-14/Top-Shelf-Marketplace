const router = require("express").Router();
const axios = require("axios");
const StreamDBService = require("../Services/stream_db.service");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
// The secret key that will be used to sign the RTMP URL
const secretKey = "your-secret-key";
router.get("/", async (req, res) => {
  try {
    switch (true) {
      case req.query.page != undefined && req.query.limit != undefined:
        let limit = parseInt(req.query.limit);
        let page = parseInt(req.query.page);
        let category = null;
        if (req.query.category != undefined && req.query.category != "all") {
          category = req.query.category;
        }

        let streams = await StreamDBService.paginatedStreams(
          1,
          limit,
          category
        );
        if (streams == null) {
          return res.status(404).json({ streams: [] });
        }
        return res.status(200).json({ streams });
        break;
      case req.query.page != undefined && req.query.limit == undefined:
        return res.status(400).json({ error: "Limit is required" });
        break;
      case req.query.page == undefined && req.query.limit != undefined:
        let limit2 = parseInt(req.query.limit);
        let category2 = null;
        if (req.query.category != undefined && req.query.category != "all") {
          category2 = req.query.category;
        }
        let streams2 = await StreamDBService.getSomeStreams(limit2, category2);
        if (streams2 == null) {
          return res.status(404).json({ streams: [] });
        }
        return res.status(200).json({ streams: streams2 });
        break;
      default:
        let category3 = null;
        if (req.query.category != undefined && req.query.category != "all") {
          category3 = req.query.category;
        }
        let streams3 = await StreamDBService.getAllStreams(category3);
        if (streams3 == null) {
          return res.status(404).json({ streams: [] });
        }
        return res.status(200).json({ streams: streams3 });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:streamkey", async (req, res) => {
  try {
    let stream = await StreamDBService.getStream(req.params.streamkey);
    if (stream == null) {
      return res.status(404).json({ error: "Stream not found" });
    }
    return res.status(200).json(stream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/image/:streamkey", async (req, res) => {
  try {
    let stream = await StreamDBService.getStream(req.params.streamkey);
    if (stream == null) {
      return res.status(404).json({ error: "Stream not found" });
    }
    const filePath = path.join(
      __dirname,
      "..",
      "server",
      "thumbnail",
      req.params.streamkey + ".png"
    );
    await fs.promises.stat(filePath);

    res.sendFile(filePath);
  } catch (err) {
    if (err.code == "ENOENT") {
      const defaultFilepath = path.join(
        __dirname,
        "..",
        "public",
        "fallbackthumbnail.png"
      );
      res.sendFile(defaultFilepath);
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});
module.exports = router;
