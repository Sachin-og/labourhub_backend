const express = require('express');
const Post  = require('../models/Post'); 
 // Assuming you have the Post model imported
const User = require('../models/User')
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    // Extracting data from the request body
    const { userid, content, location, isopened, isaccepted, typeofwork, durationofwork, jobimage } = req.body;

    // Check if userid is provided and valid
    if (!userid) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Optional: Additional validation for the other fields can be added here
    if (!content || !location || !typeofwork || !durationofwork) {
      return res.status(400).json({ error: 'Content, location, type of work, and duration of work are required' });
    }

    // Create the new post
    const newPost = await Post.create({
      userid, 
      content, 
      location, 
      isopened, 
      isaccepted, 
      typeofwork, 
      durationofwork, 
      jobimage
    });

    // Respond with the created post
    return res.status(201).json({ message: 'Post created successfully', post: newPost });
    
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
    try {
      const postId = req.params.id;
  
      const post = await Post.findOne({ where: { id: postId } });
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      await post.destroy();
  
      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
  });


  router.put('/edit/:id', async (req, res) => {
    try {
      const postId = req.params.id;
      const { content, location, isopened, isaccepted, typeofwork, durationofwork, jobimage } = req.body;
  
      const post = await Post.findOne({ where: { id: postId } });
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      post.content = content || post.content;
      post.location = location || post.location;
      post.isopened = isopened ?? post.isopened;
      post.isaccepted = isaccepted ?? post.isaccepted;
      post.typeofwork = typeofwork || post.typeofwork;
      post.durationofwork = durationofwork || post.durationofwork;
      post.jobimage = jobimage || post.jobimage;
  
      await post.save();
  
      return res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json({ message: 'Error updating post', error: error.message });
    }
  });

// Route to get posts by userId
router.get('/:userid', async (req, res) => {
    const { userid } = req.params;
  
    try {
      const posts = await Post.findAll({
        where: { userid }, // Filter posts by userId
        include: {
          model: User, // Include the associated User data
          attributes: ['name', 'city'], // Specify which user fields to include
        },
        order: [['createdAt', 'DESC']], // Sort posts by creation date in descending order
      });
      
      if (posts.length === 0) {
        return res.status(404).json({ message: 'No posts found for this user' });
      }
  
      res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching posts' });
    }
  });

module.exports = router;
