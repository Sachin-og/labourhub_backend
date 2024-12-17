const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

// Create Post Route
router.post('/create', async (req, res) => {
  try {
    const { userid, content, location, isopened, isaccepted, typeofwork, durationofwork, jobimage } = req.body;

    if (!userid) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!content || !location || !typeofwork || !durationofwork) {
      return res.status(400).json({ error: 'Content, location, type of work, and duration of work are required' });
    }

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

    return res.status(201).json({ message: 'Post created successfully', post: newPost });

  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

// Delete Post Route (Now sets isOpen to false)
router.delete('/delete/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Set the isopened field to false instead of deleting the post
    post.isopened = false;
    await post.save();

    return res.status(200).json({ message: 'Post closed successfully', post });

  } catch (error) {
    console.error('Error closing post:', error);
    return res.status(500).json({ message: 'Error closing post', error: error.message });
  }
});

// Edit Post Route (Unchanged)
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

// Get Posts by User ID (Fetch only open posts)
router.get('/open/:userid', async (req, res) => {
  const { userid } = req.params;

  try {
    const posts = await Post.findAll({
      where: {
        userid,
        isopened: true, // Only fetch open posts
      },
      include: {
        model: User,
        attributes: ['name', 'city'], // Include associated user details
      },
      order: [['createdAt', 'DESC']], // Sort posts by creation date in descending order
    });

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No open posts found for this user' });
    }

    res.json(posts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Get Posts by User ID (Fetch only closed posts)
router.get('/closed/:userid', async (req, res) => {
  const { userid } = req.params;

  try {
    const posts = await Post.findAll({
      where: {
        userid,
        isopened: false, // Only fetch closed posts
      },
      include: {
        model: User,
        attributes: ['name', 'city'],
      },
      order: [['createdAt', 'DESC']],
    });

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No closed posts found for this user' });
    }

    res.json(posts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching closed posts' });
  }
});

// Get All Posts by User ID (Fetch both open and closed posts)
router.get('/all/:userid', async (req, res) => {
  const { userid } = req.params;

  try {
    const posts = await Post.findAll({
      where: {
        userid,
      },
      include: {
        model: User,
        attributes: ['name', 'city'],
      },
      order: [['createdAt', 'DESC']],
    });

    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found for this user' });
    }

    res.json(posts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching all posts' });
  }
});

module.exports = router;
