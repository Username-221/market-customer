const { pbkdf2, randomBytes } = require('crypto');
const { promisify } = require('util');
const { sign } = require('jsonwebtoken');
const { auth } = require('../../config');

const HASH_ROUNDS = 746;
const HASH_KEYLEN = 64;
const REFRESH_TOKEN_SIZE = 16;

const pbkdf2Promised = promisify(pbkdf2);

const generateSalt = () => randomBytes(auth.saltSize);

const encryptPassword = (password, salt = Buffer.from('')) => {
  const buffPassword = Buffer.from(password);
  return pbkdf2Promised(buffPassword, salt, HASH_ROUNDS, HASH_KEYLEN, auth.digest);
};

const compare = (hash, password, salt) => encryptPassword(password, salt)
  .then(encrypted => encrypted.equals(hash));

const signJWT = (payload) => sign(payload, auth.secret, auth.jwtOptions);

const generateTokenPair = (payload) => ({
  accessToken: sign(payload, auth.secret, auth.jwtOptions),
  refreshToken: randomBytes(REFRESH_TOKEN_SIZE).toString('base64'),
});

const generateRestoreToken = () => randomBytes(16);

module.exports = {
  encryptPassword,
  generateSalt,
  compare,
  signJWT,
  generateTokenPair,
  generateRestoreToken,
};
