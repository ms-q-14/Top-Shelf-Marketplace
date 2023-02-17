const express = require("express");
const app = express();
const port = 3002;
const httpServer = require("http").Server(app);
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
};
app.use(cors(corsOptions));

// //routes
const cartRoutes = require("./Routes/cart_routes");
app.use("/api/cart/", cartRoutes);

httpServer.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
