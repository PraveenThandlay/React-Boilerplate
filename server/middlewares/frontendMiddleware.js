/* eslint-disable global-require */
const path = require('path');
const pkg = require(path.resolve(process.cwd(), 'package.json'));
const axios = require('axios');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const cookieSession = require('cookie-session');
const env = require('./config');
const apiProvider = require('../apiProvider');

const addDevMiddlewares = (app, webpackConfig) => {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);

  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    silent: true,
    stats: 'errors-only',
  });

  const setCookies = (cookieArr = [], callback) => {
    if (cookieArr.length > 0) {
      cookieArr.forEach(element => {
        const key = element.substr(0, element.indexOf('=')); // "72"
        const ckVal = element.substr(element.indexOf('=') + 1).split(';');
        const value = ckVal[0];
        console.log('Key ==>', key);
        console.log('Value ==>', value);
        if (key) {
          if (key !== 'VZSESSION' && key !== 'userLoggedIn') {
            callback.cookie(key, value, {
              expires: 0,
              httpOnly: true,
              path: '/',
              secure: true,
            });
          }
          if (key === 'userLoggedIn') {
            callback.cookie(key, value);
          }
        }
      });
    }
  }

  app.use(middleware);
  app.use(bodyParser.json());
  app.use(webpackHotMiddleware(compiler));
  app.set('trust proxy', 1); // trust first proxy

  app.use(
    cookieSession({
      name: 'session',
      keys: ['key1', 'key2'],
    }),
  );

  // Express Session
  app.use(
    session({
      secret: 'secret',
      saveUninitialized: true,
      resave: true,
    }),
  );

  const transport = axios.create({
    baseURL: env.path,
    withCredentials: true,
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  function getCookiebyName(name, cookie) {
    if (cookie) {
      const pair = cookie.match(new RegExp(`${name}=([^;]+)`));
      return pair ? pair[1] : null;
    }
    return null;
  }

  app.get('/fonts/:fileName', (req, res) => {
    const filePath = path.join(process.cwd(), pkg.fontsPath, req.params.fileName.replace(/^\//, ''));
    res.sendFile(filePath);
  });

  app.get('/content/wcms/*', (req, res) => {
    res.json(apiProvider.getApiResponse(req.originalUrl));
  });

  // Passport init
  app.use(passport.initialize());
  app.use(passport.session());

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem;
  app.get('*', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    });
  });
  app.post('/getCustomerDetails', (req, res) => {
    console.log(req);
    transport.post(req.originalUrl, req.body).then((result) => {
      // setCookies(result.headers['set-cookie'], res);
      res.json(apiProvider.getApiResponse(req.originalUrl));
    }, (err) => {
      res.json(err);
    })
  });

}; // end addmiddleware

module.exports = app => {
  const webpackConfig = require('../../internals/webpack/webpack.nodedev.babel');
  addDevMiddlewares(app, webpackConfig);
  return app;
};
