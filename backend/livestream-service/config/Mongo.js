const mongoose = require("mongoose");
const Stream = require("../db/Models/StreamSchema");
require("dotenv").config();

class Mongo {
  static instance = null;
  constructor() {
    if (Mongo.instance) {
      return Mongo.instance;
    }
    Mongo.instance = this;
    this._connect();
  }

  _connect() {
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Database connection successful");
        //drop Stream collection

        mongoose.connection.db
          .dropCollection("streams")
          .then(() => {
            console.log("Collection dropped");
          })
          .catch((err) => {
            console.log("Collection not dropped");
          });
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }
}

module.exports = new Mongo();
