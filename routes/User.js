const express = require('express');
const bcrypt = require('bcrypt'); // For hashing passwords
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator'); // For validation
const User = require("../models/User"); // Adjust path if needed
// For comparing hashed passwords
const jwt = require('jsonwebtoken'); // Adjust path if needed
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware")
// JWT secret key (use an environment variable in production)
const JWT_SECRET =process.env.JWT_SECRET_KEY;
// Validation and user creation
router.post(
  '/create',
  [
    // Validation rules
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('city').optional().isString().withMessage('City must be a string'),
  ],
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, city } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user in the database
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword, // Store the hashed password
        city: city || 'Jaipur', // Default city to 'Jaipur' if not provided
      });

      res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, name: newUser.name, email: newUser.email, city: newUser.city } });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'An error occurred while creating the user' });
    }
  }
);

//login logic here 

router.post(
    '/login',
    [
      // Validation rules
      body('email').isEmail().withMessage('Valid email is required'),
      body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        // Find the user in the database
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
  
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
  
        // Generate a JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email }, // Payload
          JWT_SECRET, // Secret key
          { expiresIn: '1h' } // Token expiry
        );
  
        res.status(200).json({
          message: 'Login successful',
          token, // Send the token to the client
          user: { id: user.id, name: user.name, email: user.email, city: user.city },
        });
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login' });
      }
    }
  );
  
  

module.exports = router;
