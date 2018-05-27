const UserModule = require('./../modules/UserModule')
const logger = require('./../utils/Logger');


class UserController {
  constructor(){
    this.router = require('express').Router();
    this.router.post('/', this.processCreateUser)
  }

  processCreateUser(req, res, next) {
    logger.debug('processCreateUser');
    let module = new UserModule();
    module.createUser(req.body)
      .then(next, next);
  }

  getRouter(){
    return this.router
  }
}


module.exports = UserController;