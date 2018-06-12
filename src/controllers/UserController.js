const UserModule = require('./../modules/UserModule');
const logger = require('dinodog-framework/src/utils/Logger');
const ServiceError = require('dinodog-framework/src/utils/ServiceError');
const StatusCode = require('dinodog-framework/src/utils/StatusCode');
const BaseController = require('dinodog-framework/src/base/BaseController');



class UserController extends BaseController{
  constructor() {
    super();
    logger.info('UserController');
    this.router = require('express').Router();
    this.router.post('/', this.processCreateUser);
    this.router.get('/', this.processGetUsers);
    this.router.get('/:username', this.processGetUsersById);
    this.router.put('/:username', this.processUpdateUser);
    this.router.delete('/:username', this.processDeleteUser);
    this.router.put('/:username/roles', this.processUpdateRoles);
  }

  processCreateUser(req, res, next) {
    logger.debug('processCreateUser');
    if (req.isAuthenticated) {
      let module = new UserModule();
      module.createUser(req.body)
        .then(next, next)
    }
    else {
      throw new ServiceError('Authentication Failed.', StatusCode.AUTH_FAILURE);
    }
  }

  processGetUsers(req, res, next) {
    logger.debug('processGetUser');
    if (req.isAuthenticated) {
      let module = new UserModule();
      module.getUsers()
        .then(next, next);
    }
    else {
      throw new ServiceError('Authentication Failed.', StatusCode.AUTH_FAILURE);
    }
  }

  processGetUsersById(req, res, next) {
    logger.debug('processGetUser');
    if (req.isAuthenticated) {
      let module = new UserModule();
      module.getUser(req.params.username)
        .then(next, next);
    }
    else {
      throw new ServiceError('Authentication Failed.', StatusCode.AUTH_FAILURE);
    }
  }

  processUpdateUser(req, res, next) {
    logger.debug('processGetUser');
    if (req.isAuthenticated) {
      let module = new UserModule();
      module.updateUser(req.params.username, req.body)
        .then(next, next);
    }
    else {
      throw new ServiceError('Authentication Failed.', StatusCode.AUTH_FAILURE);
    }
  }

  processDeleteUser(req, res, next) {
    logger.debug('processGetUser');
    if (req.isAuthenticated) {
      let module = new UserModule();
      module.deleteUser(req.params.username)
        .then(next, next);
    }
    else {
      throw new ServiceError('Authentication Failed.', StatusCode.AUTH_FAILURE);
    }
  }

  processUpdateRoles(req, res, next){
    if (req.isAuthenticated){
      //TODO: check if user i authorised to perform function
    }else{
      throw new ServiceError('Authentication Failed.', StatusCode.AUTH_FAILURE);
    }
  }
}


module.exports = UserController;