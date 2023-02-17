const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = 3001;
const fs = require("fs");
const credentials = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};
// const httpsServer = require("https").Server(credentials, app);
const httpServer = require("http").Server(app);
const cors = require("cors");
const fileUpload = require("express-fileupload");
// database
const db = require("./config/Mongo");
//routes
//whitelist localhost 5173 with cors
const corsOptions = {
  origin: ["http://cart-service"],
  credentials: true,
};
app.use(cors(corsOptions));

const productRoutes = require("./Routes/product_routes");
//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use("/api/product/", productRoutes);

httpServer.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
