const node_media_server = require("./media_server");
// Add import at the start of file
const thumbnail_generator = require("./cron/thumbnails");
const Mongo = require("./config/Mongo");
const port = process.env.PORT || 3003;
const express = require("express");
const cors = require("cors");
const app = express();
const httpServer = require("http").Server(app);
const fs = require("fs");
const path = require("path");
//middleware
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static("server/thumbnail"));
app.use(express.static("public"));

//routes
const streamRoutes = require("./Routes/stream_routes");
app.use("/api/stream/", streamRoutes);

//delete all files in ./server/media and ./server/thumbnails on server start
const mediaDir = "server/media/live";
const thumbnailDir = "server/thumbnail";

//delete files from thumbnail directory
fs.readdir(thumbnailDir, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(thumbnailDir, file), (err) => {
      if (err) throw err;
    });
  }
});

httpServer.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});

node_media_server.run();
