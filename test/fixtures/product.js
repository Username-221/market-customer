const { Types } = require('mongoose');

const product = {
  _id: Types.ObjectId(),
  name: 'Iphonech',
  description: 'no data',
  category: 'mobile',
  price: 56.21,
  shippingPrice: 24.12,
  msrp: 445.23,
  inventory: 57,
  views: 34,
  specs: [{
    key: 'weight',
    value: '55',
  },
  {
    key: 'color',
    value: 'black',
  },
  ],
  image: 'file.jpg',
  images: [
    'file2.jpg',
    'file3.jpg',
  ],
};

module.exports = { product };
