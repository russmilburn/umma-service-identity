isValid = function isValid(param) {
  if (param !== null && typeof param !== 'undefined' && param !== '' ){
    return true;
  } else {
    return false;
  }
};

isInvalid = function isInvalid(msgObj) {
  if (!msgObj || msgObj === null || typeof msgObj === 'undefined'){
    return true;
  }
  else {
    return false;
  }
};

validateInput = function validateInput(msgObj, required) {
  let self = this;
  let valid = true;
  let message = "";
  let missing = [];
  if(this.isInvalid(msgObj))
  {
    message = 'Request body is undefined or null...returning error';
    valid = false;
  }
  else{
    required.forEach(function(value){
      if (self.isInvalid(msgObj[value])) {
        missing.push(value);
        valid = false;
      }
    });
  }

  if (!valid) {
    if (!message){
      message = 'Mandatory field(s): ' + missing.toString() + ' missing in request body.';
    }
    return message;
  }
  return valid;
};


module.exports.isValid = isValid;
module.exports.isInvalid = isInvalid;
module.exports.validateInput = validateInput;
