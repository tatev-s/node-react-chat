'use strict';
import moment from "moment";
module.exports = (sequelize, DataTypes) => {
  const Files = sequelize.define('Files', {
    chatId: DataTypes.INTEGER,
    senderId: DataTypes.INTEGER,
    file: DataTypes.STRING,
    deleted: DataTypes.BOOLEAN,
    isRead: DataTypes.BOOLEAN,
    createdAt: {
      type:DataTypes.DATE,
      get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD h:mm:ss');
      }
    },
    updatedAt: {
      type:DataTypes.DATE,
      get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-D h:mm:ss');
      }
    },
  }, {});
  Files.associate = function(models) {
    Files.belongsTo(models.Chats, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    Files.belongsTo(models.User,{
      foreignKey: 'senderId',
      onDelete: 'CASCADE'
    });
  };
  return Files;
};
