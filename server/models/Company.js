const mongoose = require('mongoose');
const _ = require('lodash');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    plans: [{ name: { type: String }, price: { type: Number, default: 0 } }],
    extras: [{ name: { type: String }, price: { type: Number, default: 0 } }],
    email: { type: String, unique: true },
    localUsers: { type: ObjectId, ref: 'localUser' },
    clientUsers: { type: ObjectId, ref: 'clientUser' }
    // maybe add subcriptions: { type: ObjectId, ref: ""}
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('company', schema);
