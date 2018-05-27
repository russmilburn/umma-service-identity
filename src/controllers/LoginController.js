const LoginModule = require('./../modules/LoginModule');
const logger = require('./../utils/Logger');


class LoginController{
  constructor(){
    this.router = require('express').Router();
    this.router.post('/', this.processLogin)
  }

  processLogin(req, res, next) {
    logger.debug('processLogin');
    let module = new LoginModule();
    module.login(req.body.username, req.body.password)
      .then(next, next);
  }

  getRouter(){
    return this.router
  }
}

module.exports = LoginController;