const bunyen = require('bunyan');
const env = require('./Environment');


function createLogger() {
  let serviceName = env.getProperty('SERVICE_NAME', 'umma-service-identity');
  let serviceVersion = env.getProperty('SERVICE_VERSION', 'v0');
  let debugLevel = env.getProperty('LOG_LEVEL', 'debug');

  let options = {
    name: serviceName,
    ver: serviceVersion,
    streams: [
      {
        level: debugLevel,
        stream: process.stdout
      }
    ]
  };
  return bunyen.createLogger(options);
}

let logger = createLogger();

logger.trace = bunyen.prototype.trace;
logger.debug = bunyen.prototype.debug;
logger.info = bunyen.prototype.info;
logger.warn = bunyen.prototype.warn;
logger.error = bunyen.prototype.error;
logger.fatal = bunyen.prototype.fatal;

module.exports = logger;
