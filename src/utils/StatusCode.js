const STATUS_CODE = Object.freeze({
  SUCCESS : 200,
  ACCEPTED : 202,
  INVALID_INPUT : 400,
  ERROR : 400,
  AUTH_FAILURE : 401,
  FORBIDDEN : 403,
  NOT_FOUND : 404,
  CONFLICT : 409,
  SERVER_ERROR : 500,
  NOT_IMPLEMENTED : 501,
  SERVICE_UNAVAILABLE : 503
});

function createCode(serviceName, method, key){
  return serviceName + '.' + method + '.' + key;
}


module.exports = STATUS_CODE;
module.exports.createCode = createCode;


