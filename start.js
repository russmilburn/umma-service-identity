const env = require('./src/utils/Environment');
env.readConfig('./config/common-config');

let IdentityService = require('./src/IdentityService');
let service = new IdentityService();
service.init();
