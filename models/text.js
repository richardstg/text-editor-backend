const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const textSchema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: false },
  created: { type: Date, required: true, trim: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Text", textSchema);
