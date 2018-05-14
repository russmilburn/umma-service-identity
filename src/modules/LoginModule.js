function LoginModule() {
  
  
  this.login = function login(username, password) {
    console.log('user logged in :', username);
    return true;
  }
  
}

module.exports = LoginModule;