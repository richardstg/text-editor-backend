const express = require("express");

const pdfControllers = require("../controllers/pdf-controllers");

const router = express.Router();

router.post("/", pdfControllers.createPdf);

module.exports = router;
