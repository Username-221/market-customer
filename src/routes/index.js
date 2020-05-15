const express = require('express');
const user = require('./user');
const product = require('./product');
const cart = require('./cart');

const router = express.Router();

router
  .use('/user', user)
  .use('/product', product)
  .use('/cart', cart);

module.exports = router;
