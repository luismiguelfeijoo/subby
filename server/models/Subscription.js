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
    plans: [
      {
        plan: { type: ObjectId, ref: 'plan' },
        startDate: { type: Date, default: Date.now },
        endDate: Date
      }
    ],
    extras: [
      {
        extra: { type: ObjectId, ref: 'extra' },
        date: { type: Date, default: Date.now }
      }
    ],
    level: String,
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('subscription', schema);
