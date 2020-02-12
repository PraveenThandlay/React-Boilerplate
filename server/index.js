/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable prefer-spread */
/* eslint-disable prefer-rest-params */
/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const logger = require('./logger');
const env = require('./middlewares/config');
const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const localSetUp = require('./middlewares/mockFrontEndMiddleware');
const { resolve } = require('path');
const app = express();
const https = require('https');
const http = require('http');
const fs = require('fs');

const options = {
  key: fs.readFileSync(resolve('key.pem')),
  cert: fs.readFileSync(resolve('cert.pem')),
};

const localApp = env.enableServer ? setup(app) : localSetUp(app);
const port = argv.port || process.env.PORT || 5000;

if (env.enableServer) {
  https.createServer(options, localApp).listen(port, () => {
    logger.secureAppStarted(port);
  });
} else {
  http.createServer(localSetUp(app)).listen(port, () => {
    logger.appStarted(port);
  });
}

// Start your app.
app.listen = (_err) => {
  const server = http.createServer(this);
  return server.listen.apply(server, arguments);
};
