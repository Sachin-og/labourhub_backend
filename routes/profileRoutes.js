const express = require('express');
const { User } = require('../models');
const router = express.Router();

// GET: Fetch profile by email
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT: Update profile
router.put('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const updatedData = req.body;

    const [updated] = await User.update(updatedData, {
      where: { email },
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found or no changes detected' });
    }

    const updatedUser = await User.findOne({ where: { email } });
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
