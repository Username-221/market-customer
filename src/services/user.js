const moment = require('moment');
const errors = require('http-errors');
const {
  encryptPassword,
  compare,
  generateSalt,
  generateTokenPair,
  generateRestoreToken,
} = require('../utils/auth');

class UserService {
  /**
   * @param {types.DependencyContainer} container -
   */
  constructor({ UserModel, RefreshTokenModel, logger }) {
    this.UserModel = UserModel;
    this.RefreshTokenModel = RefreshTokenModel;
    this.logger = logger;
  }

  async register({ password, ...otherFields }) {
    const salt = generateSalt();
    const hash = await encryptPassword(password, salt);
    const userDTO = { ...otherFields, hash, salt };
    try {
      const savedUser = await this.UserModel.create(userDTO);
      this.logger
        .info('User registered', { id: savedUser.id })
        .debug('User registered', savedUser);
      return UserService.getSafeUser(savedUser);
    } catch (err) {
      switch (err.code) {
        case 11000:
          throw errors(400, 'Already registered');
        default:
          throw err;
      }
    }
  }

  async login({ password, email }) {
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw errors(400, 'User not found');
    } else if (!await compare(user.hash, password, user.salt)) {
      throw errors(400, 'Incorrect password');
    }

    this.logger.info('Signed user', { id: user.id });
    return UserService.getSafeUser(user);
  }

  async refresh(userId, token) {
    const { deletedCount } = await this.RefreshTokenModel
      .deleteOne({ userId, token });
    if (!deletedCount) {
      throw errors(403, 'Incorrect data');
    }

    const safeProjection = { salt: 0, hash: 0, restore: 0 };
    const userDoc = await this.UserModel.findById(userId, safeProjection);
    return this.issueAuthTokens(userDoc);
  }

  async logout(userId) {
    const { deletedCount } = await this.RefreshTokenModel.deleteMany({ userId });
    this.logger.info('deleted tokens due to logout', { userId, deletedCount });
    return deletedCount;
  }

  async validateRestoreToken(email, restoreToken) {
    const restoreDoc = await this.UserModel
      .findOne({ email }, { id: 1, restore: 1 });
    if (!restoreDoc || !restoreDoc.restore) {
      throw errors(403, 'This account hasn\'t restore request');
    }

    this.logger.debug('validateRestoreToken restoreDoc: ', restoreDoc);
    const bufferedToken = Buffer.from(restoreToken, 'hex');
    const hashedToken = await encryptPassword(bufferedToken);
    const restoreData = restoreDoc.restore;
    if (!hashedToken.equals(restoreData.token)) {
      throw errors(403, 'Incorrect request');
    } else if (moment().isAfter(restoreData.exp)) {
      throw errors(403, 'Token has expired');
    }

    return restoreDoc.id;
  }

  async issueAuthTokens(user) {
    const pair = generateTokenPair({ user });
    const createdRefreshToken = await this.RefreshTokenModel.create({
      userId: user.id,
      token: pair.refreshToken,
    });
    this.logger
      .info('issueAuthTokens token issued for: ', user.id)
      .debug('issueAuthTokens create', createdRefreshToken);
    return pair;
  }

  async issueRestoreToken(email) {
    const restoreToken = generateRestoreToken();
    const hashedToken = await encryptPassword(restoreToken);
    await this.UserModel.updateOne({ email }, {
      $set: {
        restore: {
          token: hashedToken,
          exp: moment().add(30, 'minutes'),
        },
      },
    });
    return restoreToken.toString('hex');
  }

  async changePassword(id, password) {
    const salt = generateSalt();
    const hash = await encryptPassword(password, salt);
    await this.UserModel.updateOne(id, {
      $set: { hash, salt },
      $unset: { restore: '' },
    });
    this.logger.info('Password changed', { id });
  }

  static getSafeUser(user) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}

module.exports = UserService;
