const mongoose = require('mongoose');
const _ = require('lodash');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true }, //email
    password: { type: String, required: true },
    name: {
      first: { type: String },
      last: { type: String }
    },
    subscriptions: [{ type: ObjectId, ref: 'subscription' }],
    company: { type: ObjectId, ref: 'company' },
    phone: { prefix: Number, phone: Number },
    payments: [{ date: Date, amount: Number }],
    debts: [{ date: Date, amount: Number }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('clientUser', schema);
