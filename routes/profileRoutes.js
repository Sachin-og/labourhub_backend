const express = require('express');
const { Profile } = require('../models');
const router = express.Router();

// Utility function for validating email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// GET: Fetch user profile by email (or any unique identifier)
router.get('/:email', async (req, res) => {
  const { email } = req.params;

  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }

  try {
    const profile = await Profile.findOne({ where: { email } });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT: Update user profile
router.put('/:email', async (req, res) => {
  const { email } = req.params;

  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }

  const updatedData = req.body;

  try {
    // Validate incoming data (basic example, expand as needed)
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ success: false, error: 'No data provided for update' });
    }

    const [updatedRows] = await Profile.update(updatedData, {
      where: { email },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ success: false, error: 'Profile not found or no changes detected' });
    }

    const updatedProfile = await Profile.findOne({ where: { email } });
    res.json({ success: true, message: 'Profile updated successfully', data: updatedProfile });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
