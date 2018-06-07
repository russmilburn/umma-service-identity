const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./utils/Logger');
const DbConnection = require('./database/DbConnection');
const EventQueue = require('./utils/EventQueue');

function IdentityService() {
  let self = this;
  let dbConn = new DbConnection();
  let eventQue = new EventQueue();

  this.init = function init() {
    logger.info('[SERVICE] start');

    eventQue.setMessageHandler(self.eventHandler);

    dbConn.init()
      .then(eventQue.init.bind(eventQue))
      .then(self.initExpress)
      .then(() => {
        logger.info('[SERVICE] start up successful')
      }, (err) => {
        logger.info('[SERVICE] error');
        logger.error(err);
      });
    // self.initExpress()

  };

  this.initExpress = function initExpress() {

    self.app = express();
    self.app.use(bodyParser.json());
    self.setRoutes();

    self.app.use(function (result, req, res, next) {
      res.send(result);
    });

    self.app.listen(8000, () => {
      logger.warn('[SERVICE] listening on port 8000')
    });
    return Promise.resolve();
  };

  this.setRoutes = function setRoutes() {
    self.app.use('/identity', getController('IdentityController'));

    // self.app.use('/identity/users', getController('UserController'));
  };


  function getController(name) {
    let Controller = require('./controllers/' + name);
    let controller = new Controller();
    return controller.getRouter();
  }

  this.eventHandler = function eventHandler(msg) {
    let data = msg.content.toString();
    let event = JSON.parse(data);
    logger.debug('event ::' + JSON.stringify(event));
  }
}


module.exports = IdentityService;