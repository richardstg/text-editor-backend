const HttpError = require("../models/http-error");
const Text = require("../models/text");
const User = require("../models/user");
// const Comment = require("../models/user");
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");

// const EMAIL_KEY = process.env.EMAIL_KEY;
sgMail.setApiKey(
  "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"
);

// const FRONTEND_URL = "http://localhost:3000";
const FRONTEND_URL = "https://www.student.bth.se/~rist19/editor/";

const sendInvite = async (req, res, next) => {
  const { textId, email } = req.body;

  let text;

  // Add user to authorized to text and text's comments
  try {
    text = await Text.findById(textId).populate("comments");
  } catch (err) {
    const error = new HttpError(
      "Fetching text failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!text) {
    const error = new HttpError(
      "Could not find text for the provided id.",
      500
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();

    text.authorized.push(email);
    text.comments.map((comment) => comment.authorized.push(email));

    await text.save({ session: sess });

    text.comments.map(async (comment) => await comment.save());

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Inviting user failed, please try again.", 500);
    return next(error);
  }

  const message = {
    to: email,
    from: "rist19@student.bth.se",
    subject: "Invite to edit text",
    html: `<div><h1>Invite to edit text</h1><a href='${FRONTEND_URL}/invite?email=${email}&text=${textId}'>Click here to register and edit</a><div>`,
  };

  try {
    await sgMail.send(message);
  } catch (err) {
    const error = new HttpError("Inviting user failed, please try again.", 500);
    return next(error);
  }

  res.status(200).json({ message: "Email sent successfully." });
};

exports.sendInvite = sendInvite;
