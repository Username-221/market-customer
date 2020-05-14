/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const { expect } = require('chai');
const supertest = require('supertest');
const sinon = require('sinon');
const app = require('../../src/app');
const { userRequest } = require('../fixtures/user');
const {
  UserModel,
  RefreshTokenModel,
} = require('../../src/model').models;

describe('User route', () => {
  const userPath = '/api/user';
  const registerPath = `${userPath}/register`;
  const agent = supertest.agent(app);

  /** @returns {supertest.Test} */
  const makeRequest = (uri, method = 'post') => agent[method](uri)
    .set('Content-Type', 'application/json');

  beforeEach(async () => {
    await UserModel.remove({});
    await RefreshTokenModel.remove({});
  });

  describe('POST /register', () => {
    it('should return correct value', async () => {
      const response = await makeRequest(registerPath)
        .expect('Content-Type', /json/)
        .send(userRequest);

      expect(response.body.accessToken).to.be.a('string');
      expect(response.body.refreshToken).to.be.a('string');
      expect(response.ok).to.be.true;
    });

    it('should save user to DB', async () => {
      await makeRequest(registerPath)
        .expect('Content-Type', /json/)
        .send(userRequest);

      const savedUsers = await UserModel.find({});
      const [user] = savedUsers;

      expect(savedUsers).to.have.length(1);
      expect(user).to.have.property('email', userRequest.email);
      expect(user).to.have.property('hash');
      expect(user).to.have.property('salt');
    });

    it('should reject, because of user already exists', async () => {
      await makeRequest(registerPath)
        .send(userRequest);
      const response = await makeRequest(registerPath)
        .expect(400)
        .send(userRequest);

      expect(response.error).to.have.property('text', 'Already registered');
    });
  });

  describe('PUT /refresh', () => {
    const resfreshPath = `${userPath}/refresh`;

    it('should return new tokens pair', async () => {
      const { body: tokens } = await makeRequest(registerPath)
        .send(userRequest);
      const { accessToken, refreshToken } = tokens;
      const { body: newTokens } = await makeRequest(resfreshPath, 'put')
        .auth(accessToken, { type: 'bearer' })
        .send({ refreshToken });

      expect(newTokens).to.have.property('accessToken');
      expect(newTokens).to.have.property('refreshToken');
    });

    it('should save new tokens to db', async () => {
      const { body: tokens } = await makeRequest(registerPath)
        .send(userRequest);
      const { accessToken, refreshToken } = tokens;
      const { body: newTokens } = await makeRequest(resfreshPath, 'put')
        .auth(accessToken, { type: 'bearer' })
        .send({ refreshToken });
      const result = await RefreshTokenModel.exists({
        token: newTokens.refreshToken,
      });

      expect(result).to.be.true;
    });

    it('should accept expired token', async () => {
      const timer = sinon.useFakeTimers();
      const { body: tokens } = await makeRequest(registerPath)
        .expect(200)
        .send(userRequest);
      const { accessToken, refreshToken } = tokens;
      timer.restore();

      const result = await makeRequest(resfreshPath, 'put')
        .auth(accessToken, { type: 'bearer' })
        .expect(200)
        .send({ refreshToken });

      expect(result.ok).to.be.true;
    });
  });
});
