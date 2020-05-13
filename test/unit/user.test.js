/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const chai = require('chai');
const sinon = require('sinon');
const { Model } = require('mongoose');
const logger = require('../../src/logger');
const UserService = require('../../src/services/user');
const authUtils = require('../../src/utils/auth');
const { userRequest, credentials } = require('../fixtures/user');
chai.use(require('chai-as-promised'));

describe('UserService', () => {
  const { expect } = chai;
  const sandbox = sinon.createSandbox();
  const service = new UserService({ UserModel: Model, logger });
  const defaultSalt = Buffer.from('0');
  const defaultUserId = Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
  logger.silent = true;

  afterEach(() => {
    sandbox.restore();
  });

  describe('register method', () => {
    let createStub;

    beforeEach(() => {
      const safeUser = () => ({ id: defaultUserId, email: userRequest.email });
      createStub = sandbox.stub(Model, 'create')
        .callsFake(obj => Promise.resolve({ ...obj, id: defaultUserId, safeUser }));
    });

    it('should save user to db', async () => {
      await service.register(userRequest);
      const callArgs = createStub.firstCall.args[0];

      sinon.assert.calledOnce(createStub);
      expect(callArgs.salt).to.be.an.instanceOf(Buffer, 'should save salt');
      expect(callArgs.hash).to.be.an.instanceOf(Buffer, 'should save hashed password');
    });

    it('should resolve correct value', async () => {
      const result = await service.register(userRequest);
      const userExpected = { ...userRequest };
      userExpected.id = defaultUserId;
      delete userExpected.password;

      expect(result).to.be.deep.equal(userExpected);
    });
  });

  describe('login method', () => {
    let findOneStub;

    beforeEach(async () => {
      sandbox.stub(authUtils, 'generateSalt').returns(defaultSalt);
      const resolvedHash = await authUtils
        .encryptPassword(credentials.password, defaultSalt);
      findOneStub = sandbox.stub(Model, 'findOne')
        .resolves({
          ...credentials,
          hash: resolvedHash,
          salt: defaultSalt,
          id: defaultUserId,
          password: null,
        });
    });

    it('should pass correct password', async () => {
      await service.login(credentials);
      const expected = { email: credentials.email };

      sinon.assert.calledOnceWithExactly(findOneStub, expected);
    });

    it('should reject when password incorrect', async () => {
      const login = service.login({
        ...credentials,
        password: 'some incorrect password',
      });

      await expect(login).to.be.rejectedWith('Incorrect password');
    });

    it('should return safe user in case of success', async () => {
      const result = await service.login(credentials);
      const userExpected = { ...credentials, id: defaultUserId };
      delete userExpected.password;

      expect(result).to.be.deep.equal(userExpected);
    });
  });
});
