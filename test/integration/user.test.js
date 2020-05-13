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
  const agent = supertest.agent(app);
  const userPath = '/api/user';
  const fakeTimer = sinon.useFakeTimers(new Date('2019-02-03'));

  beforeEach(async () => {
    await UserModel.remove({});
    await RefreshTokenModel.remove({});
  });

  after(() => {
    fakeTimer.restore();
  });

  describe('POST /register', () => {
    const path = `${userPath}/register`;
    const requestBody = JSON.stringify(userRequest);
    const getAgentTest = () => agent
      .post(path)
      .set('Content-Type', 'application/json');

    it('should return correct value', async () => {
      const response = await getAgentTest()
        .expect('Content-Type', /json/)
        .send(requestBody);

      expect(response.body.accessToken).to.be.a('string');
      expect(response.body.refreshToken).to.be.a('string');
      expect(response.ok).to.be.true;
    });

    it('should save user to DB', async () => {
      await getAgentTest()
        .expect('Content-Type', /json/)
        .send(requestBody);

      const savedUsers = await UserModel.find({});
      const [user] = savedUsers;

      expect(savedUsers).to.have.length(1);
      expect(user).to.have.property('email', userRequest.email);
      expect(user).to.have.property('hash');
      expect(user).to.have.property('salt');
    });

    it('should reject, because of user already exists', async () => {
      await getAgentTest()
        .send(requestBody);

      const response = await getAgentTest()
        .expect(400)
        .send(requestBody);

      expect(response.error).to.have.property('text', 'Already registered');
    });
  });
});
