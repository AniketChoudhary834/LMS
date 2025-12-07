const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { sendOtpEmail, sendPasswordResetOtp } = require("../helpers/email");

const { register, verifyOtp, login, checkAuth, forgotPassword, resetPassword } = require("../controllers/auth");


router.post("/register",register);
router.post("/verify-otp",verifyOtp);
router.post("/login",login);
router.get("/check-auth", authMiddleware,checkAuth);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);

module.exports = router;


