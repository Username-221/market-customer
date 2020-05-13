/* eslint-disable no-undef */
const sinon = require('sinon');
const { expect } = require('chai');
const EmailService = require('../../src/services/email');

describe('EmailService', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.restore();
  });

  describe('generateRestoreLink method', () => {
    it('should return correct result', async () => {
      const host = 'www.example.com';
      const restoreToken = 'sasgakaskg';
      const id = 'ogjsgjkla';
      const result = EmailService.generateRestoreLink(host, restoreToken, id);
      const expected = `${host}/restore?email=${id}&restoreToken=${restoreToken}`;

      expect(result).to.be.equal(expected);
    });
  });
});
