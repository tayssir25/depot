const express = require("express");
const router = express.Router();
const { searchForSeparators } = require("../controllers/FileCheckController");

router.post("/searchForSeparators", searchForSeparators);

module.exports = router;