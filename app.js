const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./config.json");

const textRoutes = require("./routes/text-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(cors());
app.use(express.json());

// don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
  // use morgan to log at command line
  app.use(morgan("combined")); // 'combined' outputs the Apache style LOGs
}

app.use("/", textRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  // if (res.headerSent) {
  //   return next(error);
  // }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const db =
  process.env.NODE_ENV === "test" ? "test-text-editor" : config.DB_NAME;

mongoose
  .connect(
    `mongodb://${config.DB_USER}:${config.DB_PASSWORD}@cluster0-shard-00-00.ipfwf.mongodb.net:27017,cluster0-shard-00-01.ipfwf.mongodb.net:27017,cluster0-shard-00-02.ipfwf.mongodb.net:27017/${db}?ssl=true&replicaSet=atlas-fxcg7c-shard-0&authSource=admin&retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    app.listen(process.env.PORT || 1337);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
