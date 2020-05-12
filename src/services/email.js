const { format } = require('url');
const { restoreEmailTemplate } = require('../utils/email');
const { host: appHost } = require('../../config').smtp;

class EmailService {
  /**
   * @param {types.DependencyContainer} container -
   */
  constructor({ emailTransport, logger }) {
    this.transport = emailTransport;
    this.logger = logger;
  }

  async sendRestorePassword(email, restoreToken, { ip, userAgent }) {
    const restoreLink = EmailService.generateRestoreLink(appHost, restoreToken, email);
    const html = restoreEmailTemplate({ ip, userAgent, restoreLink });
    const sendResult = await this.transport.sendMail({
      html,
      text: `If form doensn't work, follow this link ${restoreLink}`,
      to: email,
      subject: 'Password restoration',
    });
    this.logger
      .info('sendRestorePassword email have sent', sendResult)
      .debug('sendRestorePassword restore link', restoreLink);
  }

  static generateRestoreLink(host, restoreToken, email) {
    return format({
      host,
      pathname: '/restore',
      query: {
        email,
        restoreToken,
      },
    });
  }
}

module.exports = EmailService;
