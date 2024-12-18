
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification'); // Import the Notification model
const { Op } = require('sequelize');

// Route to get all notifications for a user (recent first)
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch notifications for the given user, ordered by `created_at` descending
    const notifications = await Notification.findAll({
      where: {
        user_id: userId, // Match user_id to fetch the relevant notifications
      },
      order: [['created_at', 'DESC']], // Most recent notifications first
    });

    // Return notifications
    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);

    // Handle error
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications.',
      error: error.message,
    });
  }
});

module.exports = router;
