const mongoose = require("mongoose");
require("dotenv").config();

const conn = process.env.MONGO_URI;

// let gridfs;

mongoose.set("strictQuery", true);
const connection = mongoose.connect(
  conn,
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      const db = mongoose.connection;
      console.log("Connected to MongoDB");
    }
  }
);

module.exports = connection;
