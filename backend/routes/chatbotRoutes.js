const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/chatbotController");

router.post("/chat", sendMessage);

module.exports = router;
