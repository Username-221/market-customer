const mongoose = require('mongoose');
const defaultLogger = require('../logger');
const mapSchemas = require('./schema-mapping');

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

const models = mapSchemas(mongoose.model);

module.exports = { models, init };
