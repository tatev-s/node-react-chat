'use strict';
import bcrypt from "bcrypt";
import moment from "moment";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type:DataTypes.STRING,
      allowNull: false,
      notEmpty:true,
      unique: {
        args: true,
        msg: 'Username already in use!'
      },
      validate: {
        notNull: {
          msg: 'Please enter username'
        },
        notEmpty: {
          msg: 'Please enter username'
        },
        len: {
          args: [6,40],
          msg: "Username must be at least 6 characters and less than 40 characters. "
        },
        is: {
          args: /^[A-Za-z][A-Za-z0-9-]+$/i, 
          msg: 'Username must start with a letter and  have no spaces and symbols.'
        },
        
     
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty:true,
      validate: {
        notNull: {
          msg: 'Please enter your password'
        },
        notEmpty: {
          msg: 'Please enter your password'
        },
        isNotShort: (value) => {
          if (value.length < 8) {
            throw new Error('Password should be at least 8 characters');
          }
        }
      },

    },
    repassword:{
      type:DataTypes.VIRTUAL,
      allowNull: false,
      notEmpty:true,
      validate: {
        notNull: {
          msg: 'Please enter your password confirmation'
        },
        notEmpty: {
          msg: 'Please enter your password confirmation'
        },
        comparePasswords:function(repassword){
          if (this.password != repassword) {
            throw new Error("Password confirmation doesn't match Password");
          }
        }
      },
    },
    lastLogin: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  User.associate = function(models) {
      User.hasMany(models.Messages, {
          foreignKey: {
            name: 'userId'
          },
          as: "messages"
        });
  };
  User.prototype.validPassword =  function(value) {
    if (bcrypt.compareSync(value, this.password))
      return this;
    else
      return false;
  }
  var hasSecurePassword = function(user, options, callback) {
  	user.password =  bcrypt.hashSync(user.get('password'), 10);
  };
  User.beforeCreate(function(user, options, callback) {
  	if (user.password)
  		hasSecurePassword(user, options, callback);
  	else
  		return callback(null, options);
  })

  return User;
};
