'use strict'
var bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {  
  var Users = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
  });

  Users.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  }
  return Users;
};