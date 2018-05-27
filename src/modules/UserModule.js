const logger = require('./../utils/Logger');
const DbConnection = require('./../database/DbConnection');
const SchemaList = require('./../database/schemas/SchemaList');
const Utils = require('./../utils/CommonUtilities');
const ServiceError = require('./../utils/ServiceError');
const StatusCode = require('./../utils/StatusCode');


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

    return user.save()
      .then((data) => {
        let user = data.toObject();
        delete user.password;
        return user;
      }, (err) => {
        if (err.code === 11000) {
          logger.error('Username ' + body.username +' already exists');
          let error = new ServiceError('Username ' + body.username + ' already exists', StatusCode.CONFLICT);
          return Promise.reject(error);
        }
        return err;
      })
  }

  getUsers() {

  }

  getUser(id) {

  }

  updateUser(id, user) {

  }

  deleteUser(id) {

  }

}

module.exports = UserModule


