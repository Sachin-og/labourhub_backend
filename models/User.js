const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const post = require("./Post")
const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: uuidv4, 
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(255),
    defaultValue: "Jaipur",
  },
  profilePicture: {
    type: DataTypes.STRING(255),
  },
  bio: {
    type: DataTypes.TEXT,
  },
  skills: {
    type: DataTypes.STRING(255),
  },
  experience: {
    type: DataTypes.JSON,
  },
  education: {
    type: DataTypes.JSON,
  },
  certifications: {
    type: DataTypes.JSON,
  },
  linkedin: {
    type: DataTypes.STRING(255),
  },
  github: {
    type: DataTypes.STRING(255),
  },
  website: {
    type: DataTypes.STRING(255),
  },
  image: {
    type: DataTypes.STRING(255),
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "Users", // Ensure it uses the existing table name
  timestamps: true,   // Ensure Sequelize respects the createdAt and updatedAt columns
});

User.hasMany(post, { foreignKey: 'userid' });

// Define the reverse relationship: A Post belongs to a User
post.belongsTo(User, { foreignKey: 'userid' });

module.exports = User;
