const env = require('dinodog-framework/src/utils/Environment');
env.readConfig('./config/common-config');
env.readConfig('./config/development');
env.readConfig('./config/container');

let IdentityService = require('./src/IdentityService');
let service = new IdentityService();
service.init();
