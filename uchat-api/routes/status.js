const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");


const {

    createStatus,
    getStatus,
    myStatus,
    viewStatus,
    deleteStatus

}=require("../controllers/statusController");



// Upload Status
router.post(
    "/",
    auth,
    createStatus
);


// All Status
router.get(
    "/",
    auth,
    getStatus
);


// My Status
router.get(
    "/my",
    auth,
    myStatus
);


// View Status
router.post(
    "/view/:statusId",
    auth,
    viewStatus
);


// Delete Status
router.delete(
    "/:id",
    auth,
    deleteStatus
);


module.exports = router;