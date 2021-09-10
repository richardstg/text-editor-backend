const express = require("express");

const textControllers = require("../controllers/text-controllers");

const router = express.Router();

router.get("/", textControllers.getAllTexts);
router.get("/:id", textControllers.getText);
router.post("/", textControllers.addText);
router.put("/:id", textControllers.updateText);

module.exports = router;
