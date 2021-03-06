const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const textSchema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  created: { type: Date, required: true, trim: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  comments: [{ type: mongoose.Types.ObjectId, required: true, ref: "Comment" }],
  authorized: [{ type: String, required: true }],
  code: { type: Boolean, required: true },
});

module.exports = mongoose.model("Text", textSchema);
