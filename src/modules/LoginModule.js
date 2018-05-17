const logger = require('./../utils/Logger');
const env = require('./../utils/Environment');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const DbConnection = require('./../database/DbConnection');
const SchemaList = require('./../database/schemas/SchemaList');

class Login {
  constructor() {

  }

  login(username, password) {
    logger.info('user logged in :', username);
    // let user = {u
    //   username: username,
    //   firstName: 'russell',
    //   lastName: 'milburn',
    // };

    // let User = new DbConnection().getDatabase().model(SchemaList.USER);
    // let myUser = new User();
    // myUser.username = 'russell';
    // myUser.password = 'password';
    // myUser.save().then(function (err) {
    //   if (err){
    //     logger.error(err)
    //   }
    // });

    this.getUser(username)
      .then(this.verifyUser.bind(this, password))


    return this.generateJwt(user)
      .then(this.getMyUser.bind(this));
  }

  getUser(username){
    let db = new DbConnection().getDatabase();
    let User = db.model(SchemaList.USER);
    return User.findOne({username: username})
      .then((user) =>{
        return user;
      }, (err => {
        throw err;
      }))
  }

  verifyUser(password, model){
    return model.comparePasswords(password, function (err, isMatch) {
      if (err){
        logger.error(err)
      }
      logger.info(isMatch);
    })
  }

  generateJwt(user) {
    logger.debug('generateJwt : ' + user);
    let payload = user;
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