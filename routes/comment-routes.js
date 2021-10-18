const express = require("express");

const commentControllers = require("../controllers/comment-controllers");
// const checkAuth = require("../middleware/check-auth");

const router = express.Router();

/* Make sure user is authorized */
// router.use(checkAuth);

router.get("/:textId", commentControllers.getComments);
router.put("/", commentControllers.updateComment);
router.post("/", commentControllers.addComment);
router.delete("/", commentControllers.deleteComment);

module.exports = router;
