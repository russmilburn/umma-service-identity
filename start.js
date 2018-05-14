let IdentityService = require('./src/IdentityService');
let service = new IdentityService('identity', 'v1');
service.initExpress();
