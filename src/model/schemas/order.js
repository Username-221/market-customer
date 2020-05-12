const { Schema } = require('mongoose');
const { deliveryMethod, orderStatus } = require('../../constants/order');
const cartSchema = require('./cart');

const addressSubdoc = new Schema({
  city: { type: String, lowercase: true, required: true },
  street: { type: String, lowercase: true, required: true },
  zip: { type: String, lowercase: true, required: true },
});

const productsPath = cartSchema.path('products');

const orderSchema = new Schema({
  address: {
    type: addressSubdoc,
  },
  products: productsPath,
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
  timestamps: true,
});

module.exports = orderSchema;
