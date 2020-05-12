const { Types } = require('mongoose');

class ProductService {
  /**
   * @param {types.DependencyContainer} container -
   */
  constructor({ CartModel, logger }) {
    this.CartModel = CartModel;
    this.logger = logger;
  }

  async addToCart(id = Types.ObjectId(), productInCart) {
    await this.CartModel.updateOne(id, {
      $push: {
        products: productInCart,
      },
    }, {
      upsert: true,
    });
    return id;
  }

  async removeFromCart(id, productId) {
    await this.CartModel.updateOne(id, {
      $pull: {
        products: { productId },
      },
    });
  }

  async clearCart(id) {
    const result = await this.CartModel.deleteOne(id);
    return result;
  }
}

module.exports = ProductService;
