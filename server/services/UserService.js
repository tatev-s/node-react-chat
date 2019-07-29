import model from '../models';
const {
  User
} = model;

class UserService {
  /**
   * @return {Object} users Selected from database
   */
  static adminUsers() {
    let condition = {
      isAdmin: true
    };
    return this.getUsers(condition);
  }
  /**
   * @return {Object} users Selected from database
   */
  static commonUsers() {
    let condition = {
      isAdmin: false
    };
    return this.getUsers(condition);
  }
  /**
   * @param {Object} condition
   * @return {Object} users Selected from database
   */
  static getUsers(condition = {}) {
    return User.findAll({
      where: condition,
    }).then(users => {
      return users
    }).catch(error => {
      return false;
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
        return error;
      })
  }

}
export default UserService;
