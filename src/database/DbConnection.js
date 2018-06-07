const Mongoose = require('mongoose').Mongoose;
const logger = require('./../utils/Logger');
const Q = require('q');
const SchemaList = require('./schemas/SchemaList');
const UserSchema = require('./schemas/UserSchema');
const env = require('./../utils/Environment');

let instance = null;

class DbConnection {
  constructor() {
    this.modelList = null;
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
    let dbUrl = this.createDbUrl();
    let options = {
      auto_reconnect: true
    };
    mongoose = new Mongoose();
    mongoose.promise = Q.promise;

    let promise = new Promise(function (resolve, reject) {
      logger.info('[DB] connecting to database');
      mongoose.connect(dbUrl, options, onConnComplete);

      function onConnComplete(err) {
        if (err) {
          logger.error(err.message);
          if (err.stack) {
            logger.error(err.stack);
            reject(err);
          }
        } else {
          logger.info('[DB] database connected');
          mongoose.model(SchemaList.USER, UserSchema);
          resolve(mongoose);
        }
      }
    });
    return promise;
  }

  createDbUrl(){
    let user = env.getProperty('DB_USER');
    let password = env.getProperty('DB_PASSWORD');
    let host = env.getProperty('DB_HOST');
    let port = env.getProperty('DB_PORT');
    let dbName = env.getProperty('DB_NAME');

    let dbUrl = 'mongodb://' + user + ':' + password + '@' + host + ':' + port + '/' +dbName;
    return dbUrl;
  }

  setModelList(ml){
    this.modelList
  }

  getModelList(){
    return this.modelList;
  }

  setDatabase(db) {
    this.database = db;
  }

  getDatabase() {
    return this.database;
  }
}


module.exports = DbConnection;
