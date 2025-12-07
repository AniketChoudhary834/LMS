const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP for Registration",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Welcome to Learning Portal</h2>
        <p>Your OTP for registration is:</p>
        <h1 style="color: #4CAF50;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `
  };
  console.log(otp);
  return transporter.sendMail(mailOptions);
};

const sendPasswordResetOtp = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset OTP",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Your OTP for password reset is:</p>
        <h1 style="color: #4CAF50;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `
  };
  console.log(otp);
  return transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail, sendPasswordResetOtp };


