const { createServer } = require('http');
const supertest = require('supertest');
const app = require('../../src/app');
const { port } = require('../../config').app;

app.set('port', port);
const server = createServer(app);
server.listen(port);

setTimeout(() => server.close(() => process.exit(0)), 10000);

const agent = supertest.agent(server);

/** @returns {supertest.Test} */
const makeRequest = (uri, method = 'post') => agent[method](uri)
  .set('Content-Type', 'application/json');

module.exports = {
  agent,
  makeRequest,
};
