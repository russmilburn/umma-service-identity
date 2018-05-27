const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./utils/Logger');
const DbConnection = require('./database/DbConnection');

function IdentityService() {
  let self = this;
  let dbConn = new DbConnection();

  this.init = function init() {
    logger.info('init');
    dbConn.init()
      .then(self.initExpress);
    // self.initExpress()

  };

  this.initExpress = function initExpress() {

    // logger.debug(dbConn.getDatabase());

    self.app = express();
    self.app.use(bodyParser.json());
    self.setRoutes();
    
    self.app.use(function (result, req, res, next) {
      res.send(result);
    });

    self.app.listen(8000, () => {
      logger.warn('listening on port 8000')
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
}


module.exports = IdentityService;