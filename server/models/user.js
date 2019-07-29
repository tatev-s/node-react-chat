'use strict';
import bcrypt from "bcrypt";
import moment from "moment";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type:DataTypes.STRING,
      allowNull: false,
      notEmpty:true,
      validate: {
        notNull: {
          msg: 'Please enter your name'
        },
        notEmpty: {
          msg: 'Please enter your name'
        }
      }
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      notEmpty:true,
      unique: {
          args: true,
          msg: 'Email address already in use!'
      },
      validate: {
        notNull: {
          msg: 'Please enter your email'
        },
        notEmpty: {
          msg: 'Please enter your email'
        },
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address'
        },
      },
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
    isAdmin: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  User.associate = function(models) {
      User.hasMany(models.Chats, {
        foreignKey: {
          name: 'userId',
          allowNull: false
        },
        as: "userchats"
      });
      User.hasMany(models.Chats, {
          foreignKey: {
            name: 'adminId',
            allowNull: false
          },
          as: "adminchats"
        });
      User.hasMany(models.Messages, {
          foreignKey: {
            name: 'senderId'
          },
          as: "messages"
        });
      User.hasMany(models.Files, {
          foreignKey: {
            name: 'senderId'
          },
          as: "files"
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
  	user.email = user.email.toLowerCase();
  	if (user.password)
  		hasSecurePassword(user, options, callback);
  	else
  		return callback(null, options);
  })
  User.beforeUpdate(function(user, options, callback) {
  	user.email = user.email.toLowerCase();
  	if (user.password)
  		hasSecurePassword(user, options, callback);
  	else
  		return callback(null, options);
  })

  return User;
};
