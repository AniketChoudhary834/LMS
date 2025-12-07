const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtpEmail, sendPasswordResetOtp } = require("../helpers/email");

// In-memory stores for OTPs
const pendingRegistrations = new Map();
const pendingPasswordResets = new Map();


exports.register =  async (req, res) => {
  try {
    const { userName, userEmail, password, role } = req.body;
    console.log(req.body);

    if(!userName || !userEmail || !password) return res.status(400).json({success: false , message:"Missing Data"});

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ userEmail }, { userName }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Check if OTP already sent
    // if (pendingRegistrations.has(userEmail)) {
    //   return res.status(400).json({ success: false, message: "OTP already sent" });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    pendingRegistrations.set(userEmail, {
      userName,
      userEmail,
      password: hashedPassword,
      role: role || "user",
      otp,
      otpExpires
    });

    await sendOtpEmail(userEmail, otp);

    res.status(201).json({ success: true, message: "OTP sent to email" });
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.verifyOtp =  async (req, res) => {
  try {
    const { userEmail, otp } = req.body;
    const pending = pendingRegistrations.get(userEmail);

    if (!pending) {
      return res.status(400).json({ success: false, message: "No pending registration" });
    }

    if (pending.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (pending.otpExpires < Date.now()) {
      pendingRegistrations.delete(userEmail);
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const newUser = new User({
      userName: pending.userName,
      userEmail: pending.userEmail,
      password: pending.password,
      role: pending.role,
      // isVerified: true
    });

    await newUser.save();
    pendingRegistrations.delete(userEmail);

    res.json({ success: true, message: "Registration complete" });
  } 
  catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.login =  async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: "Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // if (!user.isVerified) {
    //   return res.status(401).json({ success: false, message: "Email not verified" });
    // }

    const userData = {
          _id: user._id,
          userName: user.userName,
          userEmail: user.userEmail,
          role: user.role
        };

    const token = jwt.sign(userData,process.env.JWT_SECRET,{ expiresIn: "120m" });

    res.json({
      success: true,
      data: {
        token,
        user: userData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.checkAuth =  async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.forgotPassword =  async (req, res) => {
  try {
    const { userEmail } = req.body;
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    pendingPasswordResets.set(userEmail, { otp, otpExpires });
    await sendPasswordResetOtp(userEmail, otp);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.resetPassword =  async (req, res) => {
  try {
    const { userEmail, otp, newPassword } = req.body;
    if(!otp || !userEmail || !newPassword) return res.status(400).json({success: false , message:"Missing Data"});
    
    const pending = pendingPasswordResets.get(userEmail);
    
    if (!pending) {
      return res.status(400).json({ success: false, message: "No pending reset" });
    }

    if (pending.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (pending.otpExpires < Date.now()) {
      pendingPasswordResets.delete(userEmail);
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const user = await User.findOne({ userEmail });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    pendingPasswordResets.delete(userEmail);

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};