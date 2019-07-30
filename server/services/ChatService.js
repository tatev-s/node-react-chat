import model from '../models';
import moment from "moment";
const {
  User,
  Chats,
  Messages,
  Files
} = model;

class ChatService {
  /**
   * @param {Object} condition Object of condition
   * @return {Object} users Selected from database
   */
  static getChats(condition = {}) {
    return Chats.findAll({
      where: condition,
      include: [{
          model: User,
          as: 'userData'
        },
        {
          model: User,
          as: 'adminData'
        }
      ]
    }).then(chats => {
      return chats
    }).catch(error => {
      return error;
    })
  }
  /**
   * @param {Object} condition Object of condition
   * @return {Object} chats Selected from database
   */
  static getChat(condition = {}) {
    return Chats.findOne({
      where: condition,
    }).then(chat => {
      return chat
    }).catch(error => {
      return error;
    })
  }
  /**
   * @param {Object} data Object of insert data
   * @return {Object} chats Selected from database
   */
  static creatChat(data) {
    return Chats.create(data)
      .then(chat => {
        return chat;
      })
  }
  /**
   * @param {Integer} chatId Chat id
   * @param {Integer} userId User id
   * @return {Object} chat Selected from database
   */
  static chatWithMessagesAndFiles(chatId, userId) {
    const chatSrvc = this;
    return Chats.findOne({
        include: [{
            model: Messages,
            where: {deleted: false},
            required: false,
            order: [
              ['createdAt', 'DESC'],
            ],
            include: [{
              model: User,
              required: true,
              attributes: ['name', 'id']
            }]
          },
          {
            model: Files,
            where: {deleted: false},
            required: false,
            order: [
              ['createdAt', 'DESC'],
            ],
            include: [{
              model: User,
              required: true,
              attributes: ['name', 'id']
            }]
          },
          {
            model: User,
            required: true,
            as: 'userData',
            attributes: ['name', 'id']
          },
          {
            model: User,
            required: true,
            as: 'adminData',
            attributes: ['name', 'id']
          }
        ],
        where: {
          id: chatId,
          deleted: false
        }
      })
      .then(data => {
        let items = [...data.Messages, ...data.Files];
        if (items.length > 0) {
          items = chatSrvc.sortItemsByDate(items);
        }
        let chat = {
          items
        };
        chat.id = data.id;
        chat.adminId = data.adminId;
        chat.userId = data.userId;
        chat.sender = userId == chat.userId ? data.adminData : data.userData;
        return chat;
      });
  }
  /**
   * @param {Integer} adminId Admin id
   * @return {Object} users Selected from database
   */
  static getChatsTree(adminId) {
    const chatSrvc = this;
    return Chats.findAll({
        include: [{
            model: Messages,
            where: {deleted: false},
            required: false,
            order: [
              ['createdAt', 'DESC'],
            ],
            include: [{
              model: User,
              required: true,
              attributes: ['name', 'id']
            }]
          },
          {
            model: Files,
            where: {deleted: false},
            order: [
              ['createdAt', 'DESC'],
            ],
            required: false,
            include: [{
              model: User,
              required: true,
              attributes: ['name', 'id']
            }]
          },
          {
            model: User,
            //where: {deleted: false},
            required: true,
            as: 'userData',
            attributes: ['name', 'id']
          },

        ],
        order: [
          ['updatedAt', 'DESC'],
        ],
        where: {
          adminId: adminId,
          deleted: false
        }
      })
      .then(chats => {
        let data = [];
        if (chats.length > 0) {
          for (let chat of chats) {
            let messages = [...chat.Messages, ...chat.Files];
            if (messages.length > 0) {
              let item = {};
              item.items = chatSrvc.sortItemsByDate(messages);
              item.id = chat.id;
              item.adminId = chat.adminId;
              item.user = chat.userData;
              data.push(item);
            }
          }
        }
        return data;
      });
  }
  /**
   * @param {Object} items Object of data
   * @return {Object} items Sorted object
   */
  static sortItemsByDate(items) {
    items.sort(function(a, b) {
      var d1 = moment(a.createdAt).format('YYYY-MM-D h:mm:ss');
      var d2 = moment(b.createdAt).format('YYYY-MM-D h:mm:ss');
      if (d1 < d2) {
        return -1;
      }
      if (d1 > d2) {
        return 1;
      }
      return 0;
    });
    return items;
  }
}
export default ChatService;
