'use strict';

const request = require('request');
const JC = require('json-cycle');
const caller = require('caller');
const ObjectId = require('mongodb').ObjectId; 
const MongoHandler = require('./handlers/mongo-handler');

const errorMessages = {
  RequestSaveError: '-> KR Request Save Error:',
  ResponseSaveError: '-> KR Response Save Error:',
  RequestError: '-> KR Request Error:',
  ConnectionError: '-> KR Connection Error:'
}

const LOG_TYPES = {
  ANY: 1,
  ERROR: 2,
  STATUS_CODE_EQ: 3,
  STATUS_CODE_NE: 4,
  STATUS_CODE_GE: 5,
  STATUS_CODE_GT: 6,
  STATUS_CODE_LE: 7,
  STATUS_CODE_LT: 8
}

class KR {
  constructor(uri, projectId) {
    this.mongoHandler = new MongoHandler(uri, projectId);
    this.projectId = projectId;
  }

  request(options, callback) {
    try {
      this._checkConnection(() => {
        const requestId = new ObjectId();
        const requestParams = {
          _id: requestId,
          projectId: this.projectId,
          callerFile: caller(),
          options,
          _createdAt: Date.now
        }
        request(options, (error, response, body) => {
          const responseId = new ObjectId();
          const responseParams = {
            _id: responseId,
            request: requestId,
            error,
            response: JC.decycle(response),
            body
          }
          let must_be_logged = false;        
          if (options && options.LOG && options.LOG.TYPE) {
            switch (options.LOG.TYPE) {
              case LOG_TYPES.ERROR:
                if (error)
                  must_be_logged = true;
                  _doLog(requestParams, responseParams, this.mongoHandler);
                break;
              case LOG_TYPES.STATUS_CODE_EQ:
                if (options.LOG.ARG && response.statusCode == options.LOG.ARG)
                  must_be_logged = true;
                  _doLog(requestParams, responseParams, this.mongoHandler);
                break;
              case LOG_TYPES.STATUS_CODE_NE:
                if (options.LOG.ARG && response.statusCode != options.LOG.ARG)
                  must_be_logged = true;
                  _doLog(requestParams, responseParams, this.mongoHandler);
                break;
              case LOG_TYPES.STATUS_CODE_GT:
                if (options.LOG.ARG && response.statusCode < options.LOG.ARG)
                  must_be_logged = true;
                  _doLog(requestParams, responseParams, this.mongoHandler);
                break;
              case LOG_TYPES.STATUS_CODE_GE:
                if (options.LOG.ARG && response.statusCode <= options.LOG.ARG)
                  must_be_logged = true;
                  _doLog(requestParams, responseParams, this.mongoHandler);
                break;
              case LOG_TYPES.STATUS_CODE_LT:
                if (options.LOG.ARG && response.statusCode > options.LOG.ARG)
                  must_be_logged = true;
                  _doLog(requestParams, responseParams, this.mongoHandler);
                break;
              case LOG_TYPES.STATUS_CODE_LE:
                if (options.LOG.ARG && response.statusCode >= options.LOG.ARG)
                  must_be_logged = true;
                  _doLog(requestParams, responseParams, this.mongoHandler);
                break;
              default:
                must_be_logged = true;
                _doLog(requestParams, responseParams, this.mongoHandler);
                break;
            }
          } else {
            must_be_logged = true;
            _doLog(requestParams, responseParams, this.mongoHandler);
          }
          return callback(error, response, body, must_be_logged);
        });
      });
    } catch (error) {
      console.error(error)
      throw new Error(errorMessages.RequestError, options, error);
    }
  }

  _checkConnection(callback) { 
    if (this.mongoHandler.connection) {     
      return callback();
    } else {    
      this.mongoHandler.connect()
        .then(() => {    
          return callback();
        })
        .catch((error) => {
          throw new Error(errorMessages.ConnectionError, error);
        });
    }
  }

  static get ANY() {
    return LOG_TYPES.ANY
  }
  
  static get ERROR() {
    return LOG_TYPES.ERROR
  }

  static get STATUS_CODE_EQ() {
    return LOG_TYPES.STATUS_CODE_EQ
  }

  static get STATUS_CODE_GE() {
    return LOG_TYPES.STATUS_CODE_GE
  }

  static get STATUS_CODE_GT() {
    return LOG_TYPES.STATUS_CODE_GT
  }

  static get STATUS_CODE_LE() {
    return LOG_TYPES.STATUS_CODE_LE
  }

  static get STATUS_CODE_LT() {
    return LOG_TYPES.STATUS_CODE_LT
  }

  static get STATUS_CODE_NE() {
    return LOG_TYPES.STATUS_CODE_NE
  }
}

function _doLog(requestParams, responseParams, mongoHandler) {
  mongoHandler.logRequest(requestParams)
    .catch((error) => {
      throw new Error(errorMessages.RequestSaveError, requestParams, error);
    });
  mongoHandler.logResponse(responseParams)
    .catch((error) => {
      throw new Error(errorMessages.ResponseSaveError, responseParams, error);
    });
}

function _getCallerFile() {
  try {
    var err = new Error();
    var callerfile;
    var currentfile;
    Error.prepareStackTrace = function (err, stack) {
      return stack;
    };
    currentfile = err.stack.shift().getFileName();
    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();
      if (currentfile !== callerfile) 
        return callerfile;
    }
    return undefined;
  } catch (_) {
    return undefined;
  }
}

module.exports = KR;
