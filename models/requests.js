'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
  projectId: {
    type: String,
    required: true
  },
  callerFile: {
    type: String,
    required: true
  },
  options: {
    type: Object,
    required: true
  },
  _createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  autoIndex: false
});

module.exports = mongoose.model('Request', requestSchema);
