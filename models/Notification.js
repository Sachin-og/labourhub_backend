// models/Notification.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Post = require('./Post');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'Users', // Reference to the Users table
      key: 'id',
    },
    allowNull: false,
  },
  post_id: {
    type: DataTypes.UUID,
    references: {
      model: 'Posts', // Reference to the Posts table
      key: 'id',
    },
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'Notifications', // Ensure this matches the table name
  timestamps: false, // Use custom created_at instead of default timestamps
});




module.exports = Notification;
