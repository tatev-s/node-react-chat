'use strict';
import moment from "moment";
module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define('Messages', {
    chatId: DataTypes.INTEGER,
    senderId: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    deleted: DataTypes.BOOLEAN,
    isRead: DataTypes.BOOLEAN,
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-D h:mm:ss');
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-D h:mm:ss');
      }
    }
  }, {});
  Messages.associate = function(models) {
    Messages.belongsTo(models.Chats, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    Messages.belongsTo(models.User, {
      foreignKey: 'senderId',
      onDelete: 'CASCADE',

    });
  };
  return Messages;
};