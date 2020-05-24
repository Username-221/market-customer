/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const { expect } = require('chai');
const { makeRequest } = require('../utils/agent');
const { order } = require('../fixtures/order');
const { product } = require('../fixtures/product');
const {
  OrderModel,
  ProductModel,
} = require('../../src/model').models;

describe('Cart route', () => {
  const userPath = '/api/cart';

  beforeEach(async () => {
    await OrderModel.deleteMany({});
    await ProductModel.deleteMany({});
  });

  describe('GET /search', () => {
    const searchPath = `${userPath}/search`;

    it.only('should respond correct value', async () => {
      await Promise.all([
        ProductModel.create(product),
        OrderModel.create(order),
      ]);
      const response = await makeRequest(searchPath, 'get')
        .query({ id: order._id.toHexString() })
        .send();

      expect(response.ok).to.be.true;
      expect(response.body).to.be.an('object');
    });
  });
});
