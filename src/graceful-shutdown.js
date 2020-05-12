const defaultLogger = require('./logger');

/**
 * @type {types.GracefulShutdown}
 */
class GracefulShootdown {
  constructor(server, dbs, logger = defaultLogger) {
    this.server = server;
    this.dbs = dbs;
    this.logger = logger;
  }

  async closeDBConnections() {
    const { logger, dbs } = this;
    const closePromises = dbs.map(db => db.close(false));
    const v = await Promise.all(closePromises);
    logger.info(`${v.length} db connection(s) closed gracefully`);
  }

  gracefullyClose() {
    this.server.close(async (err) => {
      if (err) {
        this.logger.error(err);
      }

      try {
        await this.closeDBConnections();
        process.exit(err ? 1 : 0);
      } catch (err1) {
        this.logger.error(err1);
        process.exit(1);
      }
    });
  }
}

module.exports = GracefulShootdown;
