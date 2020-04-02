const mongoose = require('mongoose');
const _ = require('lodash');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: String,
    name: {
      first: { type: String },
      last: { type: String }
    },
    type: {
      type: String,
      enum: ['admin', 'coordinator']
    },
    company: { type: ObjectId, ref: 'company' }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('localUser', schema);
