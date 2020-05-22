const { Schema } = require('mongoose');

const specsSchema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
}, {
  _id: false,
});

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, lowercase: true },
  price: { type: Number },
  shippingPrice: { type: Number },
  msrp: { type: Number },
  inventory: { type: Number, default: 0, min: 0 },
  views: { type: Number, default: 0, min: 0 },
  specs: { type: [specsSchema] },
  image: { type: String },
  images: [String],
}, {
  timestamps: true,
});

productSchema.index({
  price: 1,
}, {
  name: 'price',
});

productSchema.index({
  name: 'text',
  description: 'text',
  'specs.value': 'text',
}, {
  name: 'searching',
});

module.exports = productSchema;
