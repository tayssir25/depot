const express = require("express");
const router = express.Router();
const { searchForSeparators } = require("../controllers/FileCheckController");
const upload = require("../middleware/upload");

router.post("/searchForSeparators",upload.single("file"), searchForSeparators);

module.exports = router;