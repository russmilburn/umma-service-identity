const logger = require('./../utils/Logger');
const env = require('./../utils/Environment');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const DbConnection = require('./../database/DbConnection');
const SchemaList = require('./../database/schemas/SchemaList');
const bcrypt = require('bcrypt');
const ServiceError = require('./../utils/ServiceError');
const StatusCode = require('./../utils/StatusCode');

class Login {
  constructor() {

  }

  login(username, password) {
    logger.info('user logged in :' + username);
    return this.getUser(username)
      .then(this.verifyUser.bind(this, password))
      .then(this.generateJwt.bind(this));
  }

  getUser(username) {
    let db = new DbConnection().getDatabase();
    let User = db.model(SchemaList.USER);
    return User.findOne({username: username})
      .then((user) => {
        if (user === null){
          throw new ServiceError('User not found', StatusCode.NOT_FOUND);
        }
        return user;
      }, (err => {
        throw err;
      }))
  }

  verifyUser(candidatePassword, model) {
    return bcrypt.compare(candidatePassword, model.password)
      .then((isMatch) => {
        logger.info('verification successful :' + isMatch);
        if (isMatch) {
          return model.toObject();
        }else{
          throw new ServiceError('incorrect password', StatusCode.AUTH_FAILURE);
        }
      }, (err) => {
        logger.error(err)
        
      })
  }

  generateJwt(user) {
    logger.debug('generateJwt');
    delete user._id;
    delete user.__v;
    delete user.password;

    let payload = user;
    //TODO: get from evn config
    let minsTilExpiry = '';
    let options = {
      algorithm: 'RS256',
      expiresIn: '15m',
      jwtid: '12345',
      issuer: 'umma-service-identity'
    };
    let keyName = env.getProperty('JWT_PRIVATE_KEY', 'jwtRS256.key');
    let keyPath = path.join(__dirname, '..', '..', 'keys', keyName);
    let privateKey = fs.readFileSync(keyPath).toString();
    let promise = new Promise(function (resolve, reject) {
      jwt.sign(payload, privateKey, options, function (err, token) {
        if (err) {
          logger.error(err);
          reject(err);
        }
        let data = {
          token: token
        };
        logger.info(token);
        resolve(data);
      })
    });
    return promise;
  }

  getMyUser(data) {
    logger.debug('getMyUser: ' + data);
    return data;
  }
}


module.exports = Login;