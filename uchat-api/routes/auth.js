const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploads");

const {
    register,
    login,
    sendOTP,
    verifyOTP,
    resendOTP
} = require("../controllers/authController");


// Send OTP
router.post(
    "/send-otp",
    sendOTP
);


// Register User
router.post(
    "/register",
    upload.single("profileImage"),
    register
);


// Verify OTP
router.post(
    "/verify-otp",
    verifyOTP
);


// Resend OTP
router.post(
    "/resend-otp",
    resendOTP
);


// Login
router.post(
    "/login",
    login
);


module.exports = router;