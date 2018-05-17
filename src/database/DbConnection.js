const Mongoose = require('mongoose').Mongoose;
const logger = require('./../utils/Logger');
const Q = require('q');
const SchemaList = require('./schemas/SchemaList');
const UserSchema = require('./schemas/UserSchema');

let instance = null;

class DbConnection {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  init() {
    return this.connect()
      .then(this.setDatabase.bind(this))
  }

  connect() {
    let mongoose;
    let dbUrl = 'mongodb://guest:guest@localhost:37017/ummadb';
    let options = {
      auto_reconnect: true
    };
    mongoose = new Mongoose();
    mongoose.promise = Q.promise;

    let promise = new Promise(function (resolve, reject) {
      logger.info('connecting to database');
      mongoose.connect(dbUrl, options, onConnComplete);

      function onConnComplete(err) {
        if (err) {
          logger.error(err.message);
          if (err.stack) {
            logger.error(err.stack);
            reject(err);
          }
        } else {
          logger.info('database connected');
          mongoose.model(SchemaList.USER, UserSchema);
          resolve(mongoose);
        }
      }
    });
    return promise;
  }

  setDatabase(db) {
    this.database = db;
  }

  getDatabase() {
    return this.database;
  }
}


module.exports = DbConnection;
