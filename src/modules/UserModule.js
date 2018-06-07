const logger = require('./../utils/Logger');
const DbConnection = require('./../database/DbConnection');
const SchemaList = require('./../database/schemas/SchemaList');
const Utils = require('./../utils/CommonUtilities');
const ServiceError = require('./../utils/ServiceError');
const StatusCode = require('./../utils/StatusCode');
const EventQueue = require('./../utils/EventQueue');


class UserModule {

  constructor() {

  }

  createUser(body) {
    let valid = Utils.validateInput(body, ['username', 'password']);
    if (valid !== true) {
      let error = new ServiceError(valid, StatusCode.INVALID_INPUT);
      return Promise.reject(error);
    }
    let db = new DbConnection().getDatabase();
    let User = db.model(SchemaList.USER);
    let user = new User();
    user.username = body.username;
    user.password = body.password;
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.roles = body.roles;

    return user.save()
      .then((data) => {
        let user = data.toObject();
        delete user.password;

        return user;
      }, (err) => {
        if (err.code === 11000) {
          logger.error('Username ' + body.username + ' already exists');
          let error = new ServiceError('Username ' + body.username + ' already exists', StatusCode.CONFLICT);
          return Promise.reject(error);
        }
        return err;
      })
  }

  getUsers() {
    let db = new DbConnection().getDatabase();
    let User = db.model(SchemaList.USER);
    return User.find()
      .select({password: 0})
      .then((data) => {
        let users = [];
        data.forEach(function (item) {
          delete item.password;
          let user = item.toObject();
          users.push(user);
        });
        return users;
      }, (err) => {
        logger.error(err);

      })
  }

  getUser(username) {

    if (!Utils.isValid(username)) {
      let error = new ServiceError('You must provide a username', StatusCode.INVALID_INPUT);
      return Promise.reject(error);
    }
    let db = new DbConnection().getDatabase();
    let User = db.model(SchemaList.USER);
    return User.findOne({username: username})
      .select({password: 0})
      .then((data) => {
        if (data === null) {
          let error = new ServiceError('User not found', StatusCode.NOT_FOUND);
          return Promise.reject(error);
        }
        let user = data.toObject();
        return user;
      }, (err) => {
        logger.error(err);
      })
  }

  updateUser(username, body) {

    if (!Utils.isValid(username)) {
      let error = new ServiceError('You must provide a username', StatusCode.INVALID_INPUT);
      return Promise.reject(error);
    }

    let db = new DbConnection().getDatabase();
    let User = db.model(SchemaList.USER);
    return User.findOneAndUpdate({username: username}, body, {new: true})
      .select({password: 0})
      .then((data) => {
        if (data === null) {
          let error = new ServiceError('User not found', StatusCode.NOT_FOUND);
          return Promise.reject(error);
        }
        let user = data.toObject();
        return user;
      }, (err) => {
        logger.error(err);
      })
  }

  deleteUser(username) {
    if (!Utils.isValid(username)) {
      let error = new ServiceError('You must provide a username', StatusCode.INVALID_INPUT);
      return Promise.reject(error);
    }
    let db = new DbConnection().getDatabase();
    let User = db.model(SchemaList.USER);
    return User.findOneAndRemove({username: username}, {rawResult: true})
      .then((data) => {
        if (data !== null) {
          if (data.ok === 1) {
            return {};
          }
        }
        let error = new ServiceError('Username not found. Unable to delete', StatusCode.NOT_FOUND);
        return Promise.reject(error);
      }, (err) => {
        logger.error(err);
      })
  }

}

module.exports = UserModule;


