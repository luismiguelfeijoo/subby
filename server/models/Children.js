const mongoose = require('mongoose');
const _ = require('lodash');

const schema = new mongoose.Schema(
  {
    name: {
      first: { type: String },
      last: { type: String }
    },
    parents: { type: ObjectId, ref: 'clientUser' },
    company: { type: ObjectId, ref: 'company' },
    plan: [
      {
        name: { type: String },
        price: { type: Number, default: 0 },
        startDate: { type: Date, default: Date.now }
      }
    ],
    extra: [
      {
        name: { type: String },
        price: { type: Number, default: 0 },
        date: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('clientUser', schema);
