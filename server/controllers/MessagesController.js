import MessageService from '../services/MessageService';
import socketIo from "../helpers/socketio";

class MessagesController {
  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {function} next The callback to the next program handler
   * @return {function} res Render json
   */
  static index(req, res, next) {

    MessageService.getMessages()
      .then(messages=>{
        res.json({success:{messages}, err:null})
      })
      .catch(error=>{
        next(error)
      })
  }
    /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {function} next The callback to the next program handler
   * @return {function} res Render file
   */
  static publish(req, res, next) {
    const {message} = req.body;
    const {sub} = req.decoded;
    if(message ){
      MessageService.create({
          message, 
          userId: sub})
      .then( inserted=>{
        MessageService.getByid(inserted.id)
            .then(message=>{
              socketIo.share(message);
              res.json({success:{message},err:null})
            })
            .catch(error=>{
              next(error);
            })
        
      })
      .catch(error=>{
        next(error)
      })
    }
  }
}
export default MessagesController;
