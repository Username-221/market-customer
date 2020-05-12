const { models } = require('../model');
const { emailTransport } = require('../utils/email');
const logger = require('../logger');

const CartService = require('./cart');
const EmailService = require('./email');
const ProductService = require('./product');
const UserService = require('./user');

const container = {
  ...models,
  emailTransport,
  logger,
};

module.exports = {
  cartService: new CartService(container),
  emailService: new EmailService(container),
  productService: new ProductService(container),
  userService: new UserService(container),
};
