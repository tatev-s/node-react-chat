import AppController from './AppController';
import passport from '../helpers/passport';
import model from '../models';

const {
  User
} = model;

class UsersController extends AppController {
  /**
   */
  constructor() {
    //  this._model = model;
    super();
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
  }
  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {function} next The callback to the next program handler
   * @return {function} res Redirect to route
   */
  logout(req, res, next) {
    req.logout();
    return res.redirect('/user/signin');
  }
  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {function} next The callback to the next program handler
   * @return {function} res Render file
   */
  login(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/dashboard');
    }
    let locals = {
      formData: {},
      validationErrors: {},
      message: ''
    };
    if (req.method == 'GET') {
      return this.renderView(req, res, 'users/login', locals);
    }
    const thisObj = this;
    passport.authenticate('local', function(err, user, info) {
      locals = {
        ...locals,
        ...info
      };
      locals.formData = req.body;
      if (err) {
        return this.renderView(req, res, 'users/login', locals);
      }
      if (user) {
        req.logIn(user.dataValues, function(err) {
          if (err) {
            return next(err);
          }
          return res.redirect('/dashboard');
        });
      } else {
        return thisObj.renderView(req, res, 'users/login', locals);
      }
    })(req, res, next)
  }
  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {function} next The callback to the next program handler
   * @return {function} res Render file
   */
  signup(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/dashboard');
    }
    let locals = {
      formData: {},
      validationErrors: {}
    };
    if (req.method == 'GET') {
      return this.renderView(req, res, '/users/signup', locals);
    }
    const bodyParams = req.body;
    const {
      name,
      email,
      password,
      repassword,
      isAdmin
    } = req.body;
    return User
      .create({
        name,
        email,
        password,
        repassword,
        isAdmin
      })
      .then(userData => {
        return this.renderView(req, res, '/users/signup-success', locals);
      })
      .catch((error, data) => {
        locals.validationErrors = this.customizeErrorsObject(error);
        locals.formData = bodyParams;
        return this.renderView(req, res, '/users/signup', locals);
      });
  }
}
export default UsersController;
