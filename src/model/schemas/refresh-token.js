const { Schema, Types } = require('mongoose');

const refreshTokenSchema = new Schema({
  userId: { type: Types.ObjectId, required: true },
  token: { type: String },
  created: { type: Date, default: Date.now, expires: '60d' },
});

module.exports = refreshTokenSchema;
