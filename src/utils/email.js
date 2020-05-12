const { compileFile } = require('pug');
const { resolve } = require('path');
const nodemailer = require('nodemailer');
const { smtp } = require('../../config');

const restoreEmailPath = resolve(__dirname, '../../templates/restore-template.pug');
const restoreEmailTemplate = compileFile(restoreEmailPath);

const emailTransport = nodemailer.createTransport(smtp.transport);

module.exports = {
  emailTransport,
  restoreEmailTemplate,
};
