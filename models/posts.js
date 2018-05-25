'use strict'

module.exports = (sequelize, DataTypes) => {  
  const Posts = sequelize.define('posts', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      required: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    buzz_words: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  }, {
    underscored: true
  });

  return Posts;
};
