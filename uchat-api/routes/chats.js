const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
    createPrivateChat,
    getChats,
    getChat,
    deleteChat
} = require("../controllers/chatController");


// Create Chat
router.post("/", auth, createPrivateChat);

// Chat List
router.get("/", auth, getChats);

// Single Chat
router.get("/:chatId", auth, getChat);

// Delete Chat
router.delete("/:chatId", auth, deleteChat);

module.exports = router;