const assert = require('assert');

describe('Login Test Suite', function () {


    describe('Test cases for Login', function () {


        it('[TC1: Success] POST /login {username:String, password: String}', function () {
            const LoginModule = require('./../src/modules/LoginModule');

            let module = new LoginModule();
            assert.equal(module.login('russell', '1234'), true);
        })

        it('[TC2: Success] POST /login {username:String, password: String}', function () {
            const LoginModule = require('./../src/modules/LoginModule');

            let module = new LoginModule();
            assert.equal(module.login('russell', '1234'), true);
        })


    })
});