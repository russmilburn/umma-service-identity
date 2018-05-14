const express = require('express');
const bodyParser = require('body-parser');

function IdentityService(mService, mVersion) {
  let self = this;
  let serviceName = mService;
  let serversion  = mVersion;
  
  this.initExpress = function initExpress() {
    self.app = express();
    self.app.use(bodyParser.json());
    self.setRoutes();
    self.app.listen(8000, ()=>{ console.log('listening on port 8000')});
    return Promise.resolve();
    
  };
  
  this.setRoutes = function setRoutes() {
    self.app.use('/identity', getController('LoginController'));
  }
  
  
  function getController(name) {
    let Controller = require('./controllers/' + name);
    let controller = new Controller();
    return controller.getRouter();
  }
}



module.exports = IdentityService;