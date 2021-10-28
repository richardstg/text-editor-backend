const HttpError = require("../models/http-error");
const Text = require("../models/text");
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");

// Check if test
if (process.env.NODE_ENV === "test") {
  const dotenv = require("dotenv");
  if (dotenv) {
    dotenv.config();
  }
}

sgMail.setApiKey(process.env.EMAIL_KEY);

// const FRONTEND_URL = "http://localhost:3000";
const FRONTEND_URL = "https://www.student.bth.se/~rist19/editor";

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
    subject: "Invitation to Text Editor",
    html: `<div><h1>Invitation to Text Editor</h1><p>You have been invited to edit a text in the Text Editor.<br /><a href='${FRONTEND_URL}/#/invite?email=${email}&text=${textId}'>Click here to register and edit</a></p><div>`,
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
