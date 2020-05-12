const leanProjection = { __v: 0 };

class ProductService {
  /**
   * @param {types.DependencyContainer} container -
   */
  constructor({ ProductModel, OrderModel, logger }) {
    this.ProductModel = ProductModel;
    this.OrderModel = OrderModel;
    this.logger = logger;
  }

  productsByCategory(category) {
    return this.ProductModel.find({ category }, leanProjection).lean();
  }

  searchProducts(query) {
    return this.ProductModel.find({
      $text: { $search: query },
    }, leanProjection).limit(50).lean();
  }
}

module.exports = ProductService;
