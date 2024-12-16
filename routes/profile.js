const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Ensure correct import
const router = express.Router();

// Route to get the user's profile details
router.get('/profile', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      city: user.city,
      profilePicture: user.profilePicture,
      bio: user.bio,
      skills: user.skills,
      experience: user.experience,
      education: user.education,
      certifications: user.certifications,
      linkedin: user.linkedin,
      github: user.github,
      website: user.website,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'An error occurred while fetching the profile' });
  }
});

// Route to update user's profile details
router.put(
  '/profile/update',
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('city').optional().isString().withMessage('City must be a string'),
    body('bio').optional().isString().withMessage('Bio must be a string'),
    body('skills').optional().isString().withMessage('Skills must be a string'),
    body('profilePicture').optional().isURL().withMessage('Profile picture URL must be valid'),
    body('linkedin').optional().isURL().withMessage('LinkedIn URL must be valid'),
    body('github').optional().isURL().withMessage('GitHub URL must be valid'),
    body('website').optional().isURL().withMessage('Website URL must be valid'),
    body('experience').optional().isArray().withMessage('Experience must be an array'),
    body('education').optional().isArray().withMessage('Education must be an array'),
    body('certifications').optional().isArray().withMessage('Certifications must be an array'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, city, bio, skills, profilePicture, linkedin, github, website, experience, education, certifications } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user fields if present
      if (name) user.name = name;
      if (email) user.email = email;
      if (city) user.city = city;
      if (bio) user.bio = bio;
      if (skills) user.skills = skills;
      if (profilePicture) user.profilePicture = profilePicture;
      if (linkedin) user.linkedin = linkedin;
      if (github) user.github = github;
      if (website) user.website = website;
      if (experience) user.experience = experience;
      if (education) user.education = education;
      if (certifications) user.certifications = certifications;

      // Save the updated user details
      await user.save();

      res.status(200).json({ message: 'Profile updated successfully', user: { id: user.id, name: user.name, email: user.email, city: user.city, profilePicture: user.profilePicture, bio: user.bio, skills: user.skills, experience: user.experience, education: user.education, certifications: user.certifications, linkedin: user.linkedin, github: user.github, website: user.website } });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'An error occurred while updating the profile' });
    }
  }
);

module.exports = router;
