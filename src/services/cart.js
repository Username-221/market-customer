const { ObjectId } = require('mongoose').Types;
const errors = require('http-errors');

class CartService {
  /**
   * @param {types.DependencyContainer} container -
   */
  constructor({ OrderModel, ProductModel, logger }) {
    this.OrderModel = OrderModel;
    this.ProductModel = ProductModel;
    this.logger = logger;
  }

  async get(id) {
    return this.OrderModel.findById(id)
      .populate('products.product')
      .lean();
  }

  async addToCart(id = ObjectId(), productInCart) {
    const isProductExists = await this.ProductModel.exists({ _id: productInCart.id });
    if (!isProductExists) throw errors(400, 'Incorrect data');

    await this.OrderModel.updateOne(id, {
      $push: {
        products: productInCart,
      },
    }, {
      upsert: true,
    });
    return id;
  }

  async removeFromCart(id, productId) {
    await this.OrderModel.updateOne(id, {
      $pull: {
        products: { productId },
      },
    });
  }

  async clearCart(id) {
    const result = await this.OrderModel.deleteOne(id);
    return result;
  }
}

module.exports = CartService;
