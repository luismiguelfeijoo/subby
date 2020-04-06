const mongoose = require('mongoose');
const _ = require('lodash');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    name: {
      first: { type: String },
      last: { type: String }
    },
    parents: [{ type: ObjectId, ref: 'clientUser' }],
    company: { type: ObjectId, ref: 'company' },
    plan: [
      {
        id: { type: ObjectId, ref: 'plan' },
        startDate: { type: Date, default: Date.now }
      }
    ],
    extra: [
      {
        id: { type: ObjectId, ref: 'extra' },
        date: { type: Date, default: Date.now }
      }
    ],
    level: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('subscription', schema);
