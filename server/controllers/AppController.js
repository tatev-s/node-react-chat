import config from "../config/config.json";

class AppController {
  constructor() {
    this.notfound = this.notfound.bind(this);
  }
  /**
   * @param {Object} errors The validation errors object
   * @return {Object} customizedErrors  Customized errors objecrt
   */
  customizeErrorsObject(errors) {
    let customizedErrors = {};
    for (let error of errors.errors) {
      if (customizedErrors[error.path] == null)
        customizedErrors[error.path] = error.message;
    }
    return customizedErrors;
  }
  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {String} template The view template name
   * @param {Object} info Rendering data
   * @return {function} Render view template
   */
  renderView(req, res, template, info = {}) {
    let locals = {
      user: {},
      room: null
    };
    if (req.isAuthenticated()) {
      locals.user = req.user;
    }
    locals = {
      ...locals,
      ...info
    };
    return res.render(template, locals);
  }
  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {function} next The callback to the next program handler
   * @return {function} res Render file
   */
  notfound(req, res, next) {
    return this.renderView(req, res, 'app/notfound');
  }
}
export default AppController;