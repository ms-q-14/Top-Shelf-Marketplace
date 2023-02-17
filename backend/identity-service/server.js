const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swaggerSpec");
const express = require("express");
const app = express();
const port = 3000;
const httpServer = require("http").Server(app);
const fs = require("fs");

const credentials = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
  rejectUnauthorized: false,
};
// const httpsServer = require("https").Server(credentials, app);

const cors = require("cors");
const fileUpload = require("express-fileupload");

// database
const db = require("./config/Mongo");
//routes
//whitelist localhost 5173 with cors
const corsOptions = {
  origin: [process.env.clientUrl],
  credentials: true,
};
console.log(corsOptions);
app.use(cors(corsOptions));

const userRoutes = require("./Routes/user_routes");
//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(fileUpload());

app.use("/api/user/", userRoutes);

httpServer.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
