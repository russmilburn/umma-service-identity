const express = require('express');
const bodyParser = require('body-parser');
const logger = require('dinodog-framework/src/utils/Logger');
const DbConnection = require('dinodog-framework/src/database/DbConnection');
const EventQueue = require('dinodog-framework/src/messaging/EventQueue');
const ServiceError = require('dinodog-framework/src/utils/ServiceError');
const StatusCode = require('dinodog-framework/src/utils/StatusCode');
const Authenticate = require('dinodog-framework/src/middleware/Authenticate');
const HashMap = require('hashmap');
const SchemaList = require('./schemas/SchemaList');

class IdentityService {
  constructor() {
    this.dbConn = new DbConnection();
    this.eventQue = new EventQueue();
    // this.auth = new Authenticate();
  }

  init() {
    logger.info('[SERVICE] start');

    let schemaMap = new HashMap();
    schemaMap.set(SchemaList.USER, require('./schemas/UserSchema'));

    this.dbConn.setModelList(schemaMap);
    this.eventQue.setMessageHandler(this.eventHandler);

    this.dbConn.init()
      .then(this.eventQue.init.bind(this.eventQue))
      .then(this.initExpress.bind(this))
      .then(() => {
        logger.info('[SERVICE] start up successful')
      }, (err) => {
        logger.info('[SERVICE] error');
        logger.error(err);
      });
    // self.initExpress()

  };

  initExpress() {

    this.app = express();
    this.app.use(bodyParser.json());
    // uncomment below if the service needs to be authenticated
    // otherwise authenticate in the controller
    // this.app.use(this.auth.authenticateUser);

    this.setRoutes();

    this.app.use(function (result, req, res, next) {
      res.send(result);
    });

    this.app.listen(8000, () => {
      logger.warn('[SERVICE] listening on port 8000')
    });
    return Promise.resolve();
  };

  setRoutes() {
    this.app.use('/identity', this.getController('IdentityController'));

    this.app.all('*', function () {
      self.logger.error('Invalid URL');
      throw new ServiceError('Invalid_URL', StatusCode.NOT_FOUND);
    });
  };

  getController(name) {
    let Controller = require('./controllers/' + name);
    let controller = new Controller();
    return controller.getRouter();
  }

  eventHandler(msg) {
    let data = msg.content.toString();
    let event = JSON.parse(data);
    logger.debug('event ::' + JSON.stringify(event));
  }
}


module.exports = IdentityService;