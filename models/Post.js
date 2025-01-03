// models/Post.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Adjust the path as necessary
const User = require('./User');
const Notification = require('./Notification');


const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(2048), // Allows a URL of reasonable length
    allowNull: false,
    validate: {
      isURL: true, // Ensures that the input is a valid URL
    },
  },
  isopened: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isaccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  typeofwork: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  durationofwork: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobimage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userid: {
    type: DataTypes.UUID,
    references: {
      model: 'Users', // Make sure this matches the table name of Users
      key: 'id',
    },
    allowNull: false,
  },
}, {
  tableName: 'Posts',  // Ensure this matches the table name
  timestamps: true,   // Automatically handles createdAt and updatedAt
});


// One post can have many notifications
Post.hasMany(Notification, { foreignKey: 'post_id' });
Notification.belongsTo(Post, { foreignKey: 'post_id' });
module.exports = Post;
