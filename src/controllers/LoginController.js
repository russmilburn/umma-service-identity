const LoginModule = require('./../modules/LoginModule');


function LoginController(){
  let self = this;
  
  this.router = require('express').Router();
  
  this.router.post('/login', processLogin);
  
  console.log('LoginController');
  
  function processLogin(req, res){
    console.log('processLogin');
    let module = new LoginModule();
    res.send(module.login(req.body.username, req.body.password));
  }
}

LoginController.prototype.getRouter = function getRouter() {
  return this.router;
};

module.exports = LoginController;