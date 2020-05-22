const { model } = require('mongoose');
const orderSchema = require('./schemas/order');
const productSchema = require('./schemas/product');
const userSchema = require('./schemas/user');
const refreshTokenSchema = require('./schemas/refresh-token');

const OrderModel = model('Order', orderSchema);
const ProductModel = model('Product', productSchema);
const UserModel = model('User', userSchema);
const RefreshTokenModel = model('RefreshToken', refreshTokenSchema);

module.exports = {
  OrderModel,
  ProductModel,
  UserModel,
  RefreshTokenModel,
};
