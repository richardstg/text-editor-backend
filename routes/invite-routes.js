const express = require("express");

const inviteControllers = require("../controllers/invite-controllers");
// const checkAuth = require("../middleware/check-auth");

const router = express.Router();

/* Make sure user is authorized */
// router.use(checkAuth);

router.post("/", inviteControllers.sendInvite);
// router.post("/register", commentControllers.registerInvite);

module.exports = router;
