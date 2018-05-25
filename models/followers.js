'use strict'

module.exports = (sequelize, DataTypes) => {  
  const Followers = sequelize.define('followers', {
    follower_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    followed_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },    
  }, {
    underscored: true
  });

  return Followers;
};