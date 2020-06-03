'use strict';
import moment from "moment";
module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define('Messages', {
    userId: DataTypes.INTEGER,
    message: {
        type:DataTypes.TEXT,
        allowNull: false,
        notEmpty:true,
        notNull: {
          msg: 'Message can not be null'
        },
        notEmpty: {
          msg: 'Message can not be empty'
        },
    },
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
    Messages.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: "user"
    },)
  };
  return Messages;
};