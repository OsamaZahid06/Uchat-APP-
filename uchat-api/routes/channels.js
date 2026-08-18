const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");


const {

    createChannel,
    getChannels,
    subscribeChannel,
    myChannels,
    postMessage,
    getMessages

}=require("../controllers/channelController");



// Create Channel
router.post(
    "/",
    auth,
    createChannel
);


// All Channels
router.get(
    "/",
    auth,
    getChannels
);


// My Channels
router.get(
    "/my",
    auth,
    myChannels
);


// Subscribe
router.post(
    "/:channelId/subscribe",
    auth,
    subscribeChannel
);


// Post Message
router.post(
    "/:channelId/message",
    auth,
    postMessage
);


// Get Messages
router.get(
    "/:channelId/messages",
    auth,
    getMessages
);


module.exports = router;