const isProduction = process.env.NODE_ENV === 'production';

// eslint-disable-next-line no-unused-vars
const errorHandler = logger => (err, _req, res, next) => {
  const { status, message } = err;
  if (status) {
    res
      .status(status)
      .end(message);
  } else {
    logger.error('Unhandled error', err);
    res
      .status(500)
      .end('Internal server error');
  }
};

// eslint-disable-next-line no-unused-vars
const errorDevHandler = logger => (err, _req, res, next) => {
  if (!err.status) {
    logger.error('Unhandled error', err);
  }
  res.status(err.status || 500)
    .end(err.message);
};

const provideErrorHandler = logger => {
  if (!logger) throw new Error('Error handler: logger expected');
  return isProduction
    ? errorHandler(logger)
    : errorDevHandler(logger);
};

module.exports = provideErrorHandler;
