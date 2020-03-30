const mongoose = require('mongoose');
const _ = require('lodash');

const schema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    password: String,
    name: {
      first: { type: String },
      last: { type: String }
    },
    type: {
      type: String,
      enum: ['Admin', 'Coordinator']
    },
    company: { type: ObjectId, ref: 'company' },
    email: { type: String, unique: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('localUser', schema);
