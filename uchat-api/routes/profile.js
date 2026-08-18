const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const upload = require("../middleware/uploads");

const profileController = require("../controllers/profileController");



// Upload Profile Image

router.post(
    "/image",
    auth,
    upload.single("profileImage"),
    profileController.uploadImage
);



// Get Logged In User Profile

router.get(
    "/",
    auth,
    profileController.getProfile
);



// Update Profile

router.put(
    "/",
    auth,
    profileController.updateProfile
);



// Logout

router.put(
    "/logout",
    auth,
    profileController.logout
);



// Get User By ID

router.get(
    "/:id",
    auth,
    profileController.getProfileById
);



module.exports = router;