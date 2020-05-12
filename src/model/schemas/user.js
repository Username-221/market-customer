const { Schema } = require('mongoose');

const restoreSubdoc = new Schema({
  token: { type: String },
  exp: { type: Date },
}, {
  _id: false,
});

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  hash: { type: Buffer, required: true },
  salt: { type: Buffer, required: true },
  restore: restoreSubdoc,
});

userSchema.method('safeUser', function safeUserHandle() {
  return { id: this.id, email: this.email };
});

module.exports = userSchema;
