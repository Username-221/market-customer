class OrderService {
  /**
   * @param {types.DependencyContainer} container -
   */
  constructor({ OrderModel, logger }) {
    this.OrderModel = OrderModel;
    this.logger = logger;
  }

  async createOrder(orderDTO) {
    this.logger.info('Creating order', orderDTO);
    const result = await this.OrderModel.create(orderDTO);
    this.logger.info('Order created', { id: result.id });
    return result;
  }

  async getOrder(id) {
    return this.OrderModel.findOne(id).lean();
  }

  async updateStatus(id, status) {
    await this.OrderModel.updateOne(id, { $set: { status } });
    this.logger.info('Order status updated', { id, status });
  }
}

module.exports = OrderService;
