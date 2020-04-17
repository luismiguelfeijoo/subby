const mongoose = require('mongoose');
const _ = require('lodash');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    name: String,
    parents: [{ type: ObjectId, ref: 'clientUser' }],
    company: { type: ObjectId, ref: 'company' },
    plans: [
      {
        plan: { type: ObjectId, ref: 'plan' },
        startDate: { type: Date, default: Date.now },
        endDate: Date,
        charged: { type: Boolean, default: false },
        timesCharged: { type: Number, default: 0 }
      }
    ],
    extras: [
      {
        extra: { type: ObjectId, ref: 'extra' },
        date: { type: Date, default: Date.now },
        charged: { type: Boolean, default: false }
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
