function MockLogger(pEnable) {

  let enable = pEnable;

  this.debug = function debug(msg) {
    if (enable) {
      console.log('DEBUG: ' + msg);
    }
  };

  this.info = function info(msg) {
    if (enable) {
      console.log('INFO: ' + msg);
    }
  };

  this.warn = function warn(msg) {
    if (enable) {
      console.log('WARN: ' + msg);
    }
  };

  this.error = function error(msg) {
    if (enable) {
      console.log('ERROR: ' + msg);
    }
  };
}

module.exports = MockLogger;