const { Types } = require('mongoose');

class CartService {
  /**
   * @param {types.DependencyContainer} container -
   */
  constructor({ OrderModel, logger }) {
    this.OrderModel = OrderModel;
    this.logger = logger;
  }

  async get(id) {
    return this.OrderModel.findById(id).lean();
  }

  async addToCart(id = Types.ObjectId(), productInCart) {
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
