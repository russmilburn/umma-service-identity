const chai = require('chai');
const proxyquire = require("proxyquire");
const Q = require('q');
const HashMap = require('hashmap');

const expect = chai.expect;
const MockLogger = require('dinodog-framework/src/mocks/MockLogger');
const MockDatabase = require('dinodog-framework/src/mocks/MockDatabase');
const SchemaList = require('../src/schemas/SchemaList');


describe('Login Test Suite', function () {

  let logger;
  let module;
  let mockDatabase;
  let mockData = require('./mock-data');

  before(function (done) {
    logger = new MockLogger(true);
    logger.info('Running LoginUnitTest');
    mockDatabase = new MockDatabase();

    let schemaMap = new HashMap();
    schemaMap.set(SchemaList.USER, require('./../src/schemas/UserSchema'));

    mockDatabase.setModelList(schemaMap);

    mockDatabase.init(true).then(onSuccess, onFailure);

    function onSuccess() {
      logger.info('Mock Database connected');

      let promiseArray = [
        mockDatabase.loadMockData(SchemaList.USER, mockData.encryptedUserData),
      ];

      Q.all(promiseArray)
        .then(() => {
          logger.info('adding data successful');
          done();
        }, (err) => {
          logger.info('adding data failure');
          done(err);
        });
    }

    function onFailure(err) {
      logger.error('DB Initialization failed');
      logger.error(err.stack);
      done();
    }
  });

  beforeEach(function (done) {

    let stubs = {
      'dinodog-framework/src/utils/Logger': logger,
      'dinodog-framework/src/database/DbConnection': MockDatabase
    };
    let LoginModule = proxyquire('./../src/modules/LoginModule', stubs);
    module = new LoginModule();
    done();
  });

  after(function (done) {
    logger.info('test suite complete');
    mockDatabase.disconnect()
      .then(onSuccess, onFailure);

    function onSuccess() {
      logger.info('db disconnect success');
      done()
    }

    function onFailure(err) {
      logger.error('db disconnect failure');
      return done(err);
    };
  });


  describe('Test cases for Login', function () {

    it('[TC1: SUCCESS] POST /login {username:String, password: String}', function (done) {

      let promise = module.login('russell@livingsoup.co.uk', 'password');
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

    it('[TC2: FAILURE] POST /login user not found', function (done) {
      let promise = module.login('russell', 'password');
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
          expect(err.constructor.name).to.equal('ServiceError');
          expect(err.message).to.equal('User not found');
          done()
        } catch (e) {
          done(e)
        }
      });
    });

    it('[TC2: FAILURE] POST /login incorrect password', function (done) {
      let promise = module.login('russell@livingsoup.co.uk', '********');
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
          expect(err.constructor.name).to.equal('ServiceError');
          expect(err.message).to.equal('incorrect password');
          done()
        } catch (e) {
          done(e)
        }
      });
    });

  })
});