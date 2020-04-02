const mongoose = require('mongoose');
const _ = require('lodash');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true }, //email
    password: String,
    name: {
      first: { type: String },
      last: { type: String }
    },
    children: { type: ObjectId, ref: 'children' },
    company: { type: ObjectId, ref: 'company' },
    phone: { type: Number }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('clientUser', schema);
