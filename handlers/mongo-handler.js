'use strict';

const MongoClient = require('mongodb').MongoClient;
const Request = require('../models/requests');
const Response = require('../models/responses');

class MongoHandler {
  constructor(uri, projectId) {
    this.uri = uri;
    this.projectId = projectId;
    this.db = undefined;
  }

  connected() {
    return this.db != undefined;
  }

  connect() {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(this.uri, function (err, client) {
        if (err) return reject(err);
        this.db = client.db();
        return resolve(this.db);
      }.bind(this));
    }.bind(this));
  }

  disconnect() {
    return new Promise(function (resolve, reject) {
      this.db.close(function (err) {
        if (err) return reject(err);
        return resolve();
      }.bind(this));
    }.bind(this));
  }

  logRequest(params) {
    const request = new Request(params);
    return new Promise((resolve, reject) => {
      this.db.collection(`${this.projectId}-requests`).insertOne(request, function(err, result) {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }

  logResponse(params) {
    const response = new Response(params);
    return new Promise((resolve, reject) => {
      this.db.collection(`${this.projectId}-responses`).insertOne(response, function(err, result) {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }
}

module.exports = MongoHandler;
