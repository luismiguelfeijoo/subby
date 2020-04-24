const mongoose = require('mongoose');
const _ = require('lodash');
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema(
  {
    company: { type: ObjectId, ref: 'company' },
    roomName: { type: ObjectId, required: true },
    messages: [
      {
        text: String,
        user: ObjectId,
        from: {
          type: String,
          enum: ['local', 'client'],
        },
      },
    ],
    notifications: [
      { sentBy: { type: ObjectId }, readBy: [{ type: ObjectId }] },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('chat', schema);
