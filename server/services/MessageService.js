import model from '../models';
const {
  Messages
} = model;

class MessageService {
  /**
   * @param {Object} data Object of condition
   * @return {Object} message Inserted message in from database
   */
  static insertMessage(data) {
    return Messages.create(data)
      .then(message => {
        return message;
      })
  }
}
export default MessageService;