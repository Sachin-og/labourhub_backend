const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();

// Temporary storage for OTP (can be replaced with database)
const otpStore = {};

// Email transport setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'labourhubofficial@gmail.com', // Replace with your email
    pass: process.env.GMAIL_PASS, // Replace with your app password
  },
});

// Send OTP route
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const otp = crypto.randomInt(100000, 999999); // Generate 6-digit OTP
  otpStore[email] = otp; // Store OTP temporarily

  try {
    await transporter.sendMail({
      from: '"LabourHub" <labourhubofficial@gmail.com>',
      to: email,
      subject: 'Labour Hub verification OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    });
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP route
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

  if (otpStore[email] && otpStore[email].toString() === otp.toString()) {
    delete otpStore[email]; // Remove OTP after successful verification
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid OTP or expired' });
  }
});

module.exports = router;

