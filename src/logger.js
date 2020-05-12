const { format, transports, createLogger } = require('winston');

const consoleOptions = {
  format: format.combine(format.colorize(), format.simple()),
};

const logger = createLogger({
  transports: [
    new transports.Console(consoleOptions),
  ],
  exitOnError: false,
});

module.exports = logger;
