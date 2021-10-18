const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  row: { type: Number, required: true },
  content: { type: String, required: true },
  text: { type: mongoose.Types.ObjectId, required: true, ref: "Text" },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  created: { type: Date, required: true, trim: true },
  authorized: [{ type: String, required: true }],
});

module.exports = mongoose.model("Comment", commentSchema);
