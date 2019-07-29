import AppController from './AppController';
import passport from '../helpers/passport';
import UserService from '../services/UserService';


class DashboardController extends AppController {
  /**
   */
  constructor() {
    super();
    this.index = this.index.bind(this);
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
      user: req.user,
      title: 'Admin users list'
    };
    let users = {};
    if (req.user.isAdmin == true) {
      users = UserService.commonUsers();
      templateData.title = 'Common users list';
    } else {
      users = UserService.adminUsers();
    }
    users.then(users => {
      templateData.users = users;
      return this.renderView(req, res, 'dashboard/index', templateData);
    }).catch(error => {
      return res.redirect('/notfound');
    })
  }
}
export default DashboardController;
