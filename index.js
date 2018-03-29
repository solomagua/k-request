'use strict';

const request = require('request');
const JC = require('json-cycle');
const ObjectId = require('mongodb').ObjectId; 

const MongoHandler = require('./handlers/mongo-handler');

class KR {
  constructor(uri, projectId) {
    this.mongoHandler = new MongoHandler(uri, projectId);
    this.projectId = projectId;
  }

  request(options, callback) {
    try {
      const requestId = new ObjectId();
      const requestParams = {
        _id: requestId,
        projectId: this.projectId,
        callerFile: _getCallerFile(),
        options
      }
      this._checkConnection(() => {
        this.mongoHandler.logRequest(requestParams)
          .catch((error) => {
            throw new Error('-> KR Request Save Error:', requestParams, error);
          });
        request(options, (error, response, body) => {
          const responseId = new ObjectId();
          const responseParams = {
            _id: responseId,
            request: requestId,
            error,
            response: JC.decycle(response),
            body
          }
          this.mongoHandler.logResponse(responseParams)
            .catch((error) => {
              throw new Error('-> KR Response Save Error:', responseParams, error);
            });
          return callback(error, response, body);
        });
      });
    } catch (error) {
      console.error(error)
      throw new Error('-> KR Request Error:', options, error);
    }
  }

  _checkConnection(callback) { 
    if (this.mongoHandler.connection) {     
      return callback();
    } else {    
      this.mongoHandler.connect()
        .then(() => {    
          console.log('-> KR Request Connection OK');
          return callback();
        })
        .catch((error) => {
          throw new Error('-> KR Request Connection Error:', error);
        });
    }
  }
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
