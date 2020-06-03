import userService from "../services/UserService";


class UsersController {
  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {function} next The callback to the next program handler
   * @return {function} res Render json
   */
  static login(req, res, next) {
    const {
        username,
        password
      } = req.body;
    userService.authenticate({username, password})
      .then(data=>{
        res.json({success:data,err:null})
      })
      .catch(error=>next(error))
  }
  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {function} next The callback to the next program handler
   * @return {function} res Render json
   */
  static signup(req, res,next) {
    const {
      username,
      password,
      repassword
    } = req.body;
    return userService
      .create({
        username,
        password,
        repassword
      })
      .then(user => {
        res.json({success:{user:user.id,message:"User created successfully"},err:null})
      })
      .catch((error) => {
        next(error);
      });
  }
}
export default UsersController;
