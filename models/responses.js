'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSchema = new Schema({
  request: {
    type: Schema.Types.ObjectId
  },
  error: {
    type: Object
  },
  response: {
    type: Object
  },
  body: {
    type: Object
  },
  _createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  autoIndex: false
});

module.exports = mongoose.model('Response', responseSchema);
