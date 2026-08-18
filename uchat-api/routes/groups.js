const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");


const {

    createGroup,

    getGroups,

    addMember,

    removeMember


}=require("../controllers/groupController");



// Create Group

router.post(
    "/",
    auth,
    createGroup
);



// Get Groups

router.get(
    "/",
    auth,
    getGroups
);



// Add Member

router.post(
    "/:chatId/member",
    auth,
    addMember
);



// Remove Member

router.delete(
    "/:chatId/member/:userId",
    auth,
    removeMember
);



module.exports = router;