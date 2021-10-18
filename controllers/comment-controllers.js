const HttpError = require("../models/http-error");
const Text = require("../models/text");
const User = require("../models/user");
const Comment = require("../models/comment");
const mongoose = require("mongoose");

const getComments = async (req, res, next) => {
  const textId = req.params.textId;

  let comments;

  try {
    comments = await Comment.find({ text: textId }).sort({
      row: 1,
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching comments failed, please try again later.",
      500
    );
    return next(error);
  }

  if (comments.length < 1) {
    const error = new HttpError("There are no comments yet.", 500);
    return next(error);
  }

  res
    .status(200)
    .json(comments.map((comment) => comment.toObject({ getters: true })));
};

const addComment = async (req, res, next) => {
  const { row, content, textId } = req.body;
  const creator = req.userData.userId;
  const created = new Date();
  const createdComment = new Comment({
    row,
    content,
    text: textId,
    creator,
    created,
  });

  // Get the user that created the comment
  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating comment failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  // Get the text that the comment belongs to
  let text;

  try {
    text = await Text.findById(textId);
  } catch (err) {
    const error = new HttpError(
      "Creating comment failed, please try again.",
      500
    );
    return next(error);
  }

  if (!text) {
    const error = new HttpError("Could not find text for provided id.", 404);
    return next(error);
  }

  if (
    !(
      text.creator.toString() === creator.toString() ||
      text.authorized.includes(req.userData.email)
    )
  ) {
    const error = new HttpError(
      "You are not allowed to add comments to this text.",
      500
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();
    user.comments.push(createdComment.id);
    text.comments.push(createdComment.id);
    await user.save({ session: sess });
    await text.save({ session: sess });
    await createdComment.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating comment failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(200).json(createdComment.toObject({ getters: true }));
};

const updateComment = async (req, res, next) => {
  const creator = req.userData.userId;
  const { row, content, id } = req.body;

  let comment;

  try {
    comment = await Comment.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Fetching comment failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!comment) {
    const error = new HttpError("Could not find comment.", 500);
    return next(error);
  }

  if (
    !(
      comment.creator.toString() === creator.toString() ||
      comment.authorized.includes(req.userData.email)
    )
  ) {
    const error = new HttpError(
      "You are not allowed to update this comment.",
      500
    );
    return next(error);
  }

  comment.row = row;
  comment.content = content;

  try {
    await comment.save();
  } catch (err) {
    const error = new HttpError(
      "Updating comment failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json(comment.toObject({ getters: true }));
};

const deleteComment = async (req, res, next) => {
  const creator = req.userData.userId;
  const { id } = req.body;

  let comment;

  // Find the comment to delete, and populate with the user that created it and the text it belongs to
  try {
    comment = await Comment.findById(id).populate("creator").populate("text");
  } catch (err) {
    const error = new HttpError(
      "Deleting comment failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!comment) {
    const error = new HttpError(
      "Comment post does not exist, could not delete.",
      500
    );
    return next(error);
  }

  if (
    !(
      comment.creator.id.toString() === creator.toString() ||
      comment.authorized.includes(req.userData.email)
    )
  ) {
    const error = new HttpError(
      "You are not allowed to delete the comment from this user.",
      401
    );
    return next(error);
  }

  // Delete the comment from comments, the user's comments and the text's comments
  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    await comment.remove({ session: sess });
    comment.creator.comments.pull(id);
    await comment.creator.save({ session: sess });
    comment.text.comments.pull(id);
    await comment.text.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Deleting comment failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json(comment.toObject({ getters: true }));
};

exports.getComments = getComments;
exports.addComment = addComment;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
