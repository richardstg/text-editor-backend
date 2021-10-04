const express = require("express");

const textControllers = require("../controllers/text-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

/* Make sure user is authorized */
router.use(checkAuth);

router.get("/", textControllers.getAllTexts);
router.get("/:id", textControllers.getText);
router.post("/", textControllers.addText);
router.put("/:id", textControllers.updateText);

module.exports = router;
