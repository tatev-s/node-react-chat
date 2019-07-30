import AppController from './AppController';
import passport from '../helpers/passport';
import ChatService from '../services/ChatService';
import UserService from '../services/UserService';

class ChatsController extends AppController {
  /**
   */
  constructor() {
    super();
    this.index = this.index.bind(this);
    this.create = this.create.bind(this);
    this.messages = this.messages.bind(this);
    this.tree = this.tree.bind(this);
  }
  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {function} next The callback to the next program handler
   * @return {function} res Render file
   */
  index(req, res, next) {
    if (!req.user) {
      return res.redirect('/user/signin');
    }
    let templateData = {
      user: req.user
    };
    let condiiton = {
      userId: req.user.id
    };
    if (req.user.isAdmin) {
      condiiton = {
        adminId: req.user.id
      };
    }
    condiiton.deleted = false;
    ChatService.getChats(condiiton)
      .then(chats => {
        templateData.chats = chats;
        return this.renderView(req, res, 'chats/index', templateData);
      })
      .catch(error => {
        next(error);
      })
  }
  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {function} next The callback to the next program handler
   * @return {function} res Render file
   */
  tree(req, res, next) {
    if (!req.user || (req.user && !req.user.isAdmin)) {
      return res.redirect('/user/signin');
    }
    let templateData = {
      user: req.user
    };
    ChatService.getChatsTree(req.user.id)
      .then(chats => {
        templateData.chats = chats;
        return this.renderView(req, res, 'chats/tree', templateData);
      })
      .catch(error => {
        next(error);
      })
  }
  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {function} next The callback to the next program handler
   * @return {function} res Render file
   */
  messages(req, res, next) {
    if (!req.user) {
      return res.redirect('/user/signin');
    }
    let templateData = {
      user: req.user,
      room: req.params.chatid
    };
    ChatService.chatWithMessagesAndFiles(req.params.chatid, req.user.id)
      .then((chat) => {
        if (req.user.id == chat.adminId || req.user.id == chat.userId) {
          templateData.chat = chat;
          return this.renderView(req, res, 'chats/room', templateData);
        }
        return res.redirect('/dashboard');

      })
      .catch(error => {
        next(error);
      })
  }
  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {function} next The callback to the next program handler
   * @return {function} res Render file
   */
  create(req, res, next) {
    if (!req.user) {
      return res.redirect('/user/signin');
    }
    if (!req.params.adminid) {
      return res.redirect('/dashboard');
    }
    let templateData = {
      user: req.user
    };
    ChatService.getChat({
        userId: req.user.id,
        adminId: req.params.adminid
      })
      .then(chat => {
        if (!chat || chat.length == 0) {
          ChatService
            .creatChat({
              userId: req.user.id,
              adminId: req.params.adminid,
              deleted: false
            })
            .then(chat => {
              return res.redirect(`/chats/messages/${chat.id}`)
            })
        } else {
          return res.redirect(`/chats/messages/${chat.id}`);
        }

      })
      .catch(error => {
        next(error);
      })
  }
}
export default ChatsController;
