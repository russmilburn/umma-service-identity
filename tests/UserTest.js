const chai = require('chai');
const proxyquire = require("proxyquire");
const Q = require('q');

const expect = chai.expect;
const MockLogger = require('./mocks/MockLogger');
const MockDatabase = require('./mocks/MockDatabase');
const SchemaList = require('./../src/database/schemas/SchemaList');

describe('User Test Suite', function () {
  let logger;
  let module;
  let mockDatabase;
  let mockData = require('./mock-data');

  before(function (done) {
    logger = new MockLogger(true);
    logger.info('Running UserModuleUnitTest');
    mockDatabase = new MockDatabase();
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
      './../utils/Logger': logger,
      './../database/DbConnection': MockDatabase
    };
    let UserModule = proxyquire('./../src/modules/UserModule', stubs);
    module = new UserModule();
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

  describe('Test cases for User Module', function () {

    it('[TC1: FAILURE] POST /users create a user with username already exists', function (done) {

      let promise = module.createUser(mockData.userData[0]);
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
          expect(err.getMessage()).to.equal('Username russell@livingsoup.co.uk already exists');
          done()
        } catch (e) {
          done(e)
        }
      });
    });

    it('[TC2: SUCCESS] POST /users create a user', function (done) {

      let promise = module.createUser(mockData.userData[1]);
      promise.then((response) => {
        try {
          expect(response).to.not.be.an('undefined');
          expect(response.username).to.equal('user@gmail.com');
          expect(response.firstName).to.equal('user');
          expect(response.lastName).to.equal('user');
          done();
        } catch (e) {
          done(e);
        }
      }, (err) => {
        try {
          expect(err.constructor.name).to.not.be.an('ServiceError');
          done()
        } catch (e) {
          done(e)
        }
      });
    });

    it('[TC3: FAILURE] POST /users create a user without required fields', function (done) {

      let promise = module.createUser(mockData.userData[2]);
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
          expect(err.getMessage()).to.equal('Mandatory field(s): username,password missing in request body.');
          done()
        } catch (e) {
          done(e)
        }
      });
    });

  })


});