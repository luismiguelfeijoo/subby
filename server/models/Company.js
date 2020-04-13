const mongoose = require('mongoose');
const _ = require('lodash');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    plans: [{ type: ObjectId, ref: 'plan' }],
    extras: [{ type: ObjectId, ref: 'extra' }],
    localUsers: { type: ObjectId, ref: 'localUser' },
    clientUsers: { type: ObjectId, ref: 'clientUser' }
    // maybe add subcriptions: { type: ObjectId, ref: ""}
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('company', schema);
