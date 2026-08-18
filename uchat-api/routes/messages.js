const express = require("express");

const router = express.Router();


const auth = require("../middleware/auth");


const {

    sendMessage,

    getMessages,

    readMessage,

    deleteMessage


} = require("../controllers/messageController");




// Send message

router.post(
    "/",
    auth,
    sendMessage
);



// Get messages

router.get(
    "/:chatId",
    auth,
    getMessages
);



// Read message

router.put(
    "/read/:id",
    auth,
    readMessage
);



// Delete message

router.delete(
    "/:id",
    auth,
    deleteMessage
);



module.exports = router;