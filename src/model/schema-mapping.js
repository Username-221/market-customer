const { model } = require('mongoose');
const orderSchema = require('./schemas/order');
const productSchema = require('./schemas/product');
const userSchema = require('./schemas/user');
const refreshTokenSchema = require('./schemas/refresh-token');

module.exports = {
  OrderModel: model('Order', orderSchema),
  ProductModel: model('Product', productSchema),
  UserModel: model('User', userSchema),
  RefreshTokenModel: model('RefreshToken', refreshTokenSchema),
};
