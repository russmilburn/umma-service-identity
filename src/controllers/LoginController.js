const LoginModule = require('./../modules/LoginModule');
const logger = require('./../utils/Logger');

function LoginController() {
  let self = this;

  this.router = require('express').Router();

  this.router.post('/login', processLogin);

  logger.debug('LoginController');

  function processLogin(req, res, next) {
    logger.debug('processLogin');
    let module = new LoginModule();
    module.login(req.body.username, req.body.password)
      .then(next, function (err) {
        logger.error(err);
        logger.error(err.stack);
      });
  }
}

LoginController.prototype.getRouter = function getRouter() {
  return this.router;
};

module.exports = LoginController;