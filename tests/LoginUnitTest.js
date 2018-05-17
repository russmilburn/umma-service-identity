const chai = require('chai');
const expect = chai.expect;
const MockLogger = require('./mocks/MockLogger');
const proxyquire = require("proxyquire");


describe('Login Test Suite', function () {

  let logger = new MockLogger(true);
  let module;

  beforeEach(function (done) {
    let LoginModule = proxyquire('./../src/modules/LoginModule', {'./../utils/Logger': logger});
    module = new LoginModule();
    done();
  });

  describe('Test cases for Login', function () {

    it('[TC1: SUCCESS] POST /login {username:String, password: String}', function (done) {

      let promise = module.login('russell', '1234');
      promise.then((response) => {
        try {
          expect(response).to.not.be.an('undefined');
          expect(response.token).to.not.be.an('undefined');
          done();
        } catch (e) {
          done(e);
        }
      }, (err) => {
        try {
          expect(err.constructor.name).to.not.be.equal('ServiceError');
          done()
        } catch (e) {
          done(e)
        }
      });
    });

    it('[TC2: FAILURE] POST /login {username:String, password: String}', function () {
      expect(module.login('russell', '1234'), false);
    });
  })
});