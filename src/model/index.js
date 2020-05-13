const mongoose = require('mongoose');
const defaultLogger = require('../logger');
const models = require('./schema-mapping');

const init = (db, logger = defaultLogger) => mongoose
  .connect(db.uri, {
    ...db,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }).then(() => {
    logger.info('Connection success');
  }).catch((err) => {
    logger.error('Connection error', err);
    process.exit(-1);
  });

module.exports = {
  models,
  init,
};
