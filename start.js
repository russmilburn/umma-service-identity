const env = require('./src/utils/Environment');
env.readConfig('./config/common-config');
// env.readConfig('./config/development');

let IdentityService = require('./src/IdentityService');
let service = new IdentityService();
service.init();
