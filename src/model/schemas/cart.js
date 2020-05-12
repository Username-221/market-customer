const { Schema, Types } = require('mongoose');
const moment = require('moment');

const cartSubdoc = new Schema({
  productId: { type: Types.ObjectId, required: true, auto: false },
  count: { type: Number, default: 1, min: 1 },
}, {
  _id: false,
});

const cartSchema = new Schema({
  products: {
    type: [cartSubdoc],
    default: [],
  },
  updatedAt: {
    type: Date,
    expires: moment.duration(1, 'day'),
  },
});

cartSchema.pre(/save|update.*/, function setTimestamp() {
  this.updatedAt = moment();
});

module.exports = cartSchema;
