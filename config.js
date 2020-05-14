const { join } = require('path');
const { config: loadEnv } = require('dotenv');

const environment = process.env.NODE_ENV;
const envSuffix = environment === 'test' || environment === 'production'
  ? '.'.concat(environment)
  : '';
loadEnv({ path: join(__dirname, `.env${envSuffix}`) });

const {
  AUTH_SECRET,
  DB_URI,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  HOST,
  SMTP_FROM,
  SMTP_USER,
  SMTP_PASS,
} = process.env;

/**
 * @type {types.ProjectConfig}
 */
const config = {
  db: {
    uri: DB_URI || 'mongodb://127.0.0.1:27017',
    dbName: DB_NAME || 'market',
    user: DB_USER,
    pass: DB_PASSWORD,
    autoCreate: true,
  },
  auth: {
    secret: AUTH_SECRET,
    saltSize: 16,
    digest: 'sha512',
    length: 64,
    rounds: 2245,
    jwtOptions: {
      expiresIn: 15 * 60,
    },
  },
  smtp: {
    host: HOST || 'http://localhost:3000',
    transport: {
      service: 'gmail',
      from: SMTP_FROM || SMTP_USER,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    },
  },
};

module.exports = config;
