// const { response } = require("express");
const HttpError = require("../models/http-error");
const Text = require("../models/text");
// const { io } = require("../app");

const getAllTexts = async (req, res, next) => {
  let texts;

  try {
    texts = await Text.find().sort({
      created: -1,
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching texts failed, please try again later.",
      500
    );
    return next(error);
  }

  if (texts.length < 1) {
    const error = new HttpError("There are no texts yet.", 500);
    return next(error);
  }

  res.status(200).json(texts.map((text) => text.toObject({ getters: true })));
};

const getText = async (req, res, next) => {
  const id = req.params.id;

  let text;

  try {
    text = await Text.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Fetching text failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!text) {
    const error = new HttpError("Could not find text.", 500);
    return next(error);
  }

  res.status(200).json(text.toObject({ getters: true }));
};

const addText = async (req, res, next) => {
  const { name, content } = req.body;
  const created = new Date();
  const createdText = new Text({
    name,
    content,
    created,
  });

  try {
    await createdText.save();
  } catch (err) {
    const error = new HttpError(
      "Creating text failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({
    id: createdText.id,
    name: createdText.name,
    content: createdText.content,
  });
};

const updateText = async (req, res, next) => {
  const id = req.params.id;

  const { name, content } = req.body;

  let text;

  try {
    text = await Text.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Fetching text failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!text) {
    const error = new HttpError("Could not find text.", 500);
    return next(error);
  }

  text.name = name;
  text.content = content;

  try {
    await text.save();
  } catch (err) {
    const error = new HttpError(
      "Updating text failed, please try again later.",
      500
    );
    return next(error);
  }

  // console.log(global._io);
  console.log("updating");
  global._io.emit("text updated", text.toObject({ getters: true }));
  res.status(200).json(text.toObject({ getters: true }));
};

exports.getAllTexts = getAllTexts;
exports.getText = getText;
exports.addText = addText;
exports.updateText = updateText;
