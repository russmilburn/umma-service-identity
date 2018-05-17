class ServiceError{
  constructor(pMsg, pStatusCode, pCode, pError, pData){
    this.message = pMsg;
    this.statusCode = pStatusCode;
    this.code = pCode;
    if (pData){
      this.data = pData;
    }else{
      this.data = {};
    }
    
    if (pError){
      this.error = pError;
    }else{
      this.error = new Error(pMsg);
    }
  }
  
  getMessage(){
    return this.message;
  }
  
  getCode(){
    return this.code;
  }
  
  getStatusCode(){
    return this.statusCode;
  }
  
  getData(){
    return this.data;
  }
  
  getError(){
    return this.error;
  }
}

module.exports = ServiceError;