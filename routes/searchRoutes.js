const express = require('express');
const { Op } = require('sequelize'); // Import Sequelize operators
const User = require('../models/User'); // Import the User model
const router = express.Router();

// @route   GET /users
// @desc    Get all users or filter by name/email
// @access  Public or Protected (based on your requirement)
router.get('/users', async (req, res) => {
  try {
    const { name, email } = req.query; // Query parameters for filtering

    // Build the Sequelize where clause for filtering
    let whereClause = {};

    if (name) {
      whereClause.name = { [Op.iLike]: `%${name}%` }; // Case-insensitive LIKE search
    }

    if (email) {
      whereClause.email = { [Op.iLike]: `%${email}%` }; // Case-insensitive LIKE search
    }

    // Fetch users based on filters
    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] }, // Exclude the password field
    });

    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /users/:userId
// @desc    Get a single user's profile by userId
// @access  Public or Protected (based on your requirement)
router.get('/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findByPk(userId); // Find user by primary key (ID)
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      res.status(200).json(user); // Return the user profile
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  

module.exports = router;
