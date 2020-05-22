const { Schema, Types } = require('mongoose');
const { deliveryMethod, orderStatus } = require('../../constants/order');

const cartSubdoc = new Schema({
  product: {
    type: Types.ObjectId,
    required: true,
    auto: false,
    ref: 'Product',
  },
  count: {
    type: Number,
    default: 1,
    min: 1,
  },
}, {
  _id: false,
});

const addressSubdoc = new Schema({
  city: {
    type: String,
    lowercase: true,
    required: true,
  },
  street: {
    type: String,
    lowercase: true,
    required: true,
  },
  zip: {
    type: String,
    lowercase: true,
    required: true,
  },
}, {
  _id: false,
});

const orderSubdoc = new Schema({
  address: {
    type: addressSubdoc,
    required: true,
  },
  sum: {
    type: Number,
    min: 0,
    required: true,
  },
  deliveryMethod: {
    type: String,
    enum: Object.values(deliveryMethod),
    default: deliveryMethod.DELIVERY,
  },
  status: {
    type: String,
    enum: Object.values(orderStatus),
    default: orderStatus.ACTIVE,
  },
}, {
  id: false,
});

const orderSchema = new Schema({
  products: {
    type: [cartSubdoc],
    default: [],
  },
  order: {
    type: orderSubdoc,
  },
}, {
  timestamps: true,
});

orderSchema.index({
  'products.$.product': 1,
});

module.exports = orderSchema;
