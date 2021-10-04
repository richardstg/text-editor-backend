const express = require("express");
const { check } = require("express-validator");

const authControllers = require("../controllers/auth-controllers");

const router = express.Router();

router.post(
  "/signup",
  [
    check("email")
      .normalizeEmail({
        gmail_remove_dots: false,
      })
      .isEmail(),
    check("password").isLength({ min: 7 }),
  ],
  authControllers.signup
);

router.post("/login", authControllers.login);

module.exports = router;
