import model from '../models';
import jwt from "jsonwebtoken";
import {ValidationError,ValidationErrorItem} from "sequelize";
const {
  User
} = model;

class UserService {
  /**
   * @return {Object} users Selected from database
   */
  static create(data) {
    return User.create(data).then(user => {
      return user
    }).catch(error => {
      throw error;
    })
  }
  /**
     * @param {Object}  data login/password
     * @return {Object} User after instert
     */
    static authenticate ({username , password}) {
      return User.findOne(
        {
          where: {
            username: username
          }
        }
      )
        .then(user => {
         
          try {
            if (!user) {
              throw new ValidationError('Username does not exist',[new ValidationErrorItem('Username does not exist',null,"username",username)]) 
            }
            
            if (user.validPassword(password)) {
              console.log('process.env',process.env)
              const { password, ...userWithoutPassword } = user.toJSON();
              const token = jwt.sign({
                  sub: user.id
                }, process.env.ACCESS_TOKEN_SECRET, {
                  expiresIn: 180000
                })
                user.update({lastlogin:new Date()});
              return {
                token,
                user:userWithoutPassword,
              }
            } else {
              throw new ValidationError('Password is invalid',[new ValidationErrorItem('Password is invalid',null,"password",password)])
            }
          } catch (error) {
            throw error
          }
        })
        .catch(error => {
          throw error
        })
    }
  
  /**
   * @param {Int} id User id
   * @return {Object} user Selected user data from database
   */
  static getById(id) {
    return User.findByPk(id)
      .then((user) => {
        return user;
      })
      .catch(error => {
        throw error;
      })
  }

}
export default UserService;
