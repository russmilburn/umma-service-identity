const chai = require('chai');
const proxyquire = require("proxyquire");
const Q = require('q');
const HashMap = require('hashmap');

const expect = chai.expect;
const MockLogger = require('dinodog-framework/src/mocks/MockLogger');
const MockDatabase = require('dinodog-framework/src/mocks/MockDatabase');
const SchemaList = require('../src/schemas/SchemaList');

describe('User Test Suite', function () {
  let logger;
  let module;
  let mockDatabase;
  let mockData = require('./mock-data');

  before(function (done) {
    logger = new MockLogger(true);
    logger.info('Running UserModuleUnitTest');
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

    describe('Create user tests', function () {

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

    });

    describe('GET user tests', function () {

      it('[TC1: SUCCESS] POST /users create a user', function (done) {

        let promise = module.getUsers();
        promise.then((response) => {
          try {
            expect(response).to.not.be.an('undefined');
            expect(response.length).to.be.greaterThan(0);
            expect(response[0].firstName).to.equal('russell');
            expect(response[0].username).to.equal('russell@livingsoup.co.uk');
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

    });


    describe('GET user by username', function () {

      it('[TC1: SUCCESS] GET /users/{username} create a user', function (done) {

        let promise = module.getUser('russell@livingsoup.co.uk');
        promise.then((response) => {
          try {
            expect(response).to.not.be.an('undefined');
            expect(response.firstName).to.equal('russell');
            expect(response.lastName).to.equal('milburn');
            expect(response.username).to.equal('russell@livingsoup.co.uk');
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

      it('[TC2: FAILURE] GET /users/{username} create a user', function (done) {

        let promise = module.getUser();
        promise.then((response) => {
          try {
            expect(response).to.not.be.an('undefined');
            expect(response.firstName).to.equal('russell');
            expect(response.lastName).to.equal('milburn');
            expect(response.username).to.equal('russell@livingsoup.co.uk');
            done();
          } catch (e) {
            done(e);
          }
        }, (err) => {
          try {
            expect(err.constructor.name).to.equal('ServiceError');
            expect(err.getMessage()).to.equal('You must provide a username');
            done()
          } catch (e) {
            done(e)
          }
        });
      });

      it('[TC2: FAILURE] GET /users/{username} create a user', function (done)  {

        let promise = module.getUser('blah');
        promise.then((response) => {
          try {
            expect(response).to.not.be.an('undefined');
            expect(response.firstName).to.equal('russell');
            expect(response.lastName).to.equal('milburn');
            expect(response.username).to.equal('russell@livingsoup.co.uk');
            done();
          } catch (e) {
            done(e);
          }
        }, (err) => {
          try {
            expect(err.constructor.name).to.equal('ServiceError');
            expect(err.getMessage()).to.equal('User not found');
            done()
          } catch (e) {
            done(e)
          }
        });
      });

    });

    describe('UPDATE user by username', function () {

      it('[TC1: SUCCESS] PUT /users/{username} update a user', function (done) {

        let user = {
          firstName : 'test update',
          lastName : 'test update'
        }

        let promise = module.updateUser('russell@livingsoup.co.uk', user);
        promise.then((response) => {
          try {
            expect(response).to.not.be.an('undefined');
            expect(response.firstName).to.equal('test update');
            expect(response.lastName).to.equal('test update');
            expect(response.username).to.equal('russell@livingsoup.co.uk');
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

      it('[TC2: FAILURE] PUT /users/{username} update a user', function (done) {

        let promise = module.updateUser('', {});
        promise.then((response) => {
          try {
            expect(response).to.not.be.an('undefined');
            expect(response.firstName).to.equal('russell');
            expect(response.lastName).to.equal('milburn');
            expect(response.username).to.equal('russell@livingsoup.co.uk');
            done();
          } catch (e) {
            done(e);
          }
        }, (err) => {
          try {
            expect(err.constructor.name).to.equal('ServiceError');
            expect(err.getMessage()).to.equal('You must provide a username');
            done()
          } catch (e) {
            done(e)
          }
        });
      });

      it('[TC2: FAILURE] PUT /users/{username} update a user', function (done)  {

        let promise = module.updateUser('blah', {});
        promise.then((response) => {
          try {
            expect(response).to.not.be.an('undefined');
            expect(response.firstName).to.equal('russell');
            expect(response.lastName).to.equal('milburn');
            expect(response.username).to.equal('russell@livingsoup.co.uk');
            done();
          } catch (e) {
            done(e);
          }
        }, (err) => {
          try {
            expect(err.constructor.name).to.equal('ServiceError');
            expect(err.getMessage()).to.equal('User not found');
            done()
          } catch (e) {
            done(e)
          }
        });
      });

    });

    describe('REMOVE user by username', function () {

      it('[TC1: SUCCESS] DELETE /users/{username} delete a user', function (done) {


        let promise = module.deleteUser('russell@livingsoup.co.uk');
        promise.then((response) => {
          try {
            expect(response).to.not.be.an('undefined');
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

      it('[TC2: FAILURE] DELETE /users/{username} delete a user', function (done) {

        let promise = module.deleteUser('');
        promise.then((response) => {
          try {
            expect(response).to.not.be.an('undefined');
            expect(response.firstName).to.equal('russell');
            expect(response.lastName).to.equal('milburn');
            expect(response.username).to.equal('russell@livingsoup.co.uk');
            done();
          } catch (e) {
            done(e);
          }
        }, (err) => {
          try {
            expect(err.constructor.name).to.equal('ServiceError');
            expect(err.getMessage()).to.equal('You must provide a username');
            done()
          } catch (e) {
            done(e)
          }
        });
      });

      it('[TC2: FAILURE] DELETE /users/{username} delete a user', function (done)  {

        let promise = module.deleteUser('blah');
        promise.then((response) => {
          try {
            expect(response).to.not.be.an('undefined');
            expect(response.firstName).to.equal('russell');
            expect(response.lastName).to.equal('milburn');
            expect(response.username).to.equal('russell@livingsoup.co.uk');
            done();
          } catch (e) {
            done(e);
          }
        }, (err) => {
          try {
            expect(err.constructor.name).to.equal('ServiceError');
            expect(err.getMessage()).to.equal('Username not found. Unable to delete');
            done()
          } catch (e) {
            done(e)
          }
        });
      });

    });

  })




});