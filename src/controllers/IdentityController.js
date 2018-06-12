const Authenticate = require('dinodog-framework/src/middleware/Authenticate');
const BaseController = require('dinodog-framework/src/base/BaseController');


class IdentityController extends BaseController{
  constructor() {
    super();
    this.auth = new Authenticate();

    this.router = require('express').Router();

    this.router.use('/login', this.getController(__dirname + '/LoginController'));
    this.router.use('/users', this.auth.authenticateUser, this.getController(__dirname +'/UserController'));
  }

}

module.exports = IdentityController;