const { Types } = require('mongoose');
const { product } = require('./product');

const order = {
  _id: Types.ObjectId(),
  products: [
    {
      product: product._id,
      count: 2,
    },
  ],
};

module.exports = { order };
