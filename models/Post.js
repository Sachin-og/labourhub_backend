const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  content: { type: DataTypes.TEXT, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
});

module.exports = Post;
