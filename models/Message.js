const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary
const User = require('./User'); // Import the User model for associations

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  sender_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  receiver_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now'),
  },
}, {
  tableName: 'Messages',
  timestamps: false, // Handle custom timestamps
});

// Associations
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'Receiver' });

module.exports = Message;
