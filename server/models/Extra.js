const mongoose = require('mongoose');
const _ = require('lodash');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: ObjectId, ref: 'company' },
    price: { price: { type: String, required: true }, currency: String },
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('extra', schema);
