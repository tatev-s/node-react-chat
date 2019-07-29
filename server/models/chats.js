'use strict';
import moment from "moment";
module.exports = (sequelize, DataTypes) => {
  const Chats = sequelize.define('Chats', {
    userId: DataTypes.INTEGER,
    adminId: DataTypes.INTEGER,
    deleted: DataTypes.BOOLEAN,
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('DD/MM/YYYY h:mm:ss');
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('DD/MM/YYYY h:mm:ss');
      }
    },
  }, {});
  Chats.associate = function(models) {
    Chats.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'userData'
    });
    Chats.belongsTo(models.User, {
      foreignKey: 'adminId',
      as: 'adminData'
    });
    Chats.hasMany(models.Messages, {
      foreignKey: {
        name: 'chatId'
      }
    });
    Chats.hasMany(models.Files, {
      foreignKey: {
        name: 'chatId'
      }
    });
  };
  return Chats;
};