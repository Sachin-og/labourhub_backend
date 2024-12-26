const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const { Op } = require('sequelize'); // Make sure to import Op
const router = express.Router();
const Message = require('../models/Message'); // Ensure this is the correct path

// Send a message
router.post('/message', async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;

  try {
    if (!sender_id || !receiver_id || !content) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newMessage = await Message.create({
      sender_id,
      receiver_id,
      content,
    });

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get messages between sender and receiver
router.get('/messages/:senderId/:receiverId', async (req, res) => {
    const { senderId, receiverId } = req.params;
  
    try {
      // Fetch messages between sender and receiver
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { sender_id: senderId, receiver_id: receiverId },
            { sender_id: receiverId, receiver_id: senderId },
          ],
        },
        order: [['created_at', 'ASC']], // Order messages by creation date
      });
  
      // If messages are found, mark them as read
      if (messages && messages.length > 0) {
        await Message.update(
          { is_read: true },
          {
            where: {
              [Op.or]: [
                { sender_id: senderId, receiver_id: receiverId },
                { sender_id: receiverId, receiver_id: senderId },
              ],
              is_read: false, // Only update messages that are unread
            },
          }
        );
      }
  
      return res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });
  


// Get recent users a user has chatted with
router.get('/recent-chats/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
        const recentChats = await Message.findAll({
            where: {
              [Op.or]: [
                { sender_id: userId },
                { receiver_id: userId },
              ],
            },
            attributes: [
              [
                Sequelize.literal(`
                  CASE 
                    WHEN sender_id = '${userId}' THEN receiver_id 
                    ELSE sender_id 
                  END
                `),
                'chat_partner',
              ],
            ],
            group: ['chat_partner'],
            order: [[Sequelize.fn('MAX', Sequelize.col('created_at')), 'DESC']],
          });
          
  
      const chatPartners = recentChats.map((chat) => chat.get('chat_partner'));
  
      return res.status(200).json(chatPartners);
    } catch (error) {
      console.error('Error fetching recent chats:', error);
      return res.status(500).json({ error: 'Failed to fetch recent chats' });
    }
  });


  // Get unread message counts between the user and each other user
router.get('/unread-messages/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Find all unread messages where the given user is the receiver
      const unreadMessages = await Message.findAll({
        where: {
          receiver_id: userId,
          is_read: false,  // Only consider unread messages
        },
        attributes: [
          'sender_id',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'unread_count'],  // Count unread messages from each sender
        ],
        group: ['sender_id'],  // Group by sender_id
      });
  
      // Format the result into an object: { sender_id: unread_count }
      const unreadCounts = unreadMessages.reduce((acc, message) => {
        acc[message.sender_id] = message.get('unread_count');
        return acc;
      }, {});
  
      // Now also count unread messages for the reverse (when the user is the sender)
      const reverseUnreadMessages = await Message.findAll({
        where: {
          sender_id: userId,
          is_read: false,  // Only consider unread messages
        },
        attributes: [
          'receiver_id',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'unread_count'],  // Count unread messages for each receiver
        ],
        group: ['receiver_id'],  // Group by receiver_id
      });
  
      // Merge both counts (messages sent and received)
      reverseUnreadMessages.forEach(message => {
        const receiverId = message.receiver_id;
        const unreadCount = message.get('unread_count');
        
        // Add the reverse unread message count (sent by the user) to the object
        if (!unreadCounts[receiverId]) {
          unreadCounts[receiverId] = 0;
        }
        unreadCounts[receiverId] += unreadCount;
      });
  
      return res.status(200).json(unreadCounts);
    } catch (error) {
      console.error('Error fetching unread messages count:', error);
      return res.status(500).json({ error: 'Failed to fetch unread message counts' });
    }
  });
  
module.exports = router;
