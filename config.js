require('dotenv').config();

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
    auth: {
      user: DB_USER,
      password: DB_PASSWORD,
    },
  },
  auth: {
    secret: AUTH_SECRET,
    saltSize: 16,
    digest: 'sha512',
    length: 64,
    rounds: 2245,
    jwtOptions: {
      expiresIn: '15m',
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
