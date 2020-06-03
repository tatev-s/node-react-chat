import model from '../models';
const {
  Messages,
  User
} = model;

class MessageService {
  /**
   * @param {Object} data Object of condition
   * @return {Object} message Inserted message in from database
   */
  static create(data) {
    console.log(data)
    return Messages.create(data)
      .then(message => {
        return message;
      })
      .catch(error=>{
        throw error;
      })
  }
  /**
   * @param {Integer} id Integer 
   * @return {Object} message  from database
   */
  static getByid(id) {
    return Messages.findByPk(id,{
        include: [
          {
            attributes:['username','id'],
            model: User,
            required: true,
            as: "user"
          }
        ],
      })
      .then(message => {
        return message;
      })
      .catch(error=>{
        throw error;
      })
  }
    /**
   * @param {Object} data Object of condition
   * @return {Object} message Inserted message in from database
   */
  static getMessages(params) {

    return Messages.findAll({
      include: [
        {
          attributes:['username','id'],
          model: User,
          required: true,
          as: "user"
        }
      ],
      order: [['createdAt',"ASC"]],
    })
      .then(messages => {
        return messages;
      })
      .catch(error=>{
        throw error;
      })
  }
}
export default MessageService;