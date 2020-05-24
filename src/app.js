require('express-async-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const routes = require('./routes');
const config = require('../config');
const { init: initDB } = require('./model');
const errorHandler = require('./middlware/error');
const logger = require('./logger');

initDB(config.db, logger);

const app = express();

const morganOpts = { stream: { write: str => logger.info(str) } };

app.use(morgan('combined', morganOpts));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../public')));
app.use(passport.initialize());
app.use('/api', routes);
app.use(errorHandler(logger));
app.use((_req, res) => {
  res.sendStatus(404);
});

module.exports = app;
