

class IdentityController{
  constructor(){
    this.router = require('express').Router();

    this.router.use('/login', this.getController('LoginController'));
    this.router.use('/users', this.getController('UserController'));
  }

  getRouter(){
    return this.router;
  }

  getController(name){
    let Controller = require('./' + name);
    let controller = new Controller();
    return controller.getRouter();
  }
}


// function IdentityController() {
//
//   this.router = require('express').Router();
//
//   this.router.use('/login', getController('UserController'));
//   this.router.use('/users', getController('UserController'));
//
//
//   function getController(name) {
//     let Controller = require('./' + name);
//     let controller = new Controller();
//     return controller.getRouter();
//   }
// }
//
// IdentityController.prototype.getRouter = function getRouter() {
//   return this.router;
// };

module.exports = IdentityController;