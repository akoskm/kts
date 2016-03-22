import path    from 'path';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import Sequelize from 'sequelize';
import passport from 'passport';
import csrf from 'csurf';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import log4js from 'log4js';
import CustomStrategy from './strategy-local';
import { routes } from './routes';
import { api } from './api';
import schema from './schema';
import DataWrapper from './datawrapper';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// determine environment type
const nodeEnv = process.env.NODE_ENV || 'dev';

// app configuration
const config = require('./config').default;
const PORT = config.port;

// initialize the express app
const app = express();

// postgresql connection
const db = new Sequelize('postgres://kts:kts@localhost/kts');

// passpost strategy
const LocalStrategy = require('passport-local').Strategy;

// logger configuration
log4js.configure('config/log4js.json');
const logger = log4js.getLogger();

const mongoStore = connectMongo(session);
const sessionConfig = {
  // according to https://github.com/expressjs/session#resave
  // see "How do I know if this is necessary for my store?"
  resave: true,
  saveUninitialized: true,
  secret: config.cryptoKey,
  store: new mongoStore({ url: config.mongodb.uri }),
  cookie: {}
};

app.schema = schema(db);
app.db = db;

if (nodeEnv === 'dev') {
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    // Dev middleware can't access config, so we provide publicPath
    publicPath: webpackConfig.output.publicPath,

    // pretty colored output
    stats: { colors: true },

    // Set to false to display a list of each file that is being bundled.
    noInfo: true
  }));

  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(config.cryptoKey));

if (nodeEnv === 'prod') {
  app.set('trust proxy', 1);
  // https://github.com/expressjs/session/issues/251
  sessionConfig.cookie.secure = false;
  logger.info('using secure cookies');
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf({
  cookie: {
    signed: true
  },
  value(req) {
    const csrf = req.cookies._csrfToken;
    return csrf;
  }
}));

// response locals
app.use(function (req, res, next) {
  res.cookie('_csrfToken', req.csrfToken());
  res.locals.user = {};
  res.locals.user.defaultReturnUrl = '/';
  res.locals.user.username = req.user && req.user.username;
  next();
});

app.use(function (req, res, next) {
  GLOBAL.navigator = {
    userAgent: req.headers['user-agent']
  };
  next();
});

// global locals
app.locals.projectName = config.projectName;
app.locals.copyrightYear = new Date().getFullYear();
app.locals.copyrightName = config.companyName;
app.locals.cacheBreaker = 'br34k-01';

app.set('view engine', 'ejs');

let localStragety = new CustomStrategy(app.schema);

// passport setup
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'passw'
}, localStragety.authenticate));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  app.schema.user.find({
    where: {
      id
    }
  }).then(function (user, err) {
    if (user) {
      done(err, user.toJSON());
    }
  });
});

/* non-react routes */
app.post('/api/register', api.register);
app.post('/api/activate', api.activate);
app.post('/api/login', api.signin);
app.post('/api/logout', api.signout);
app.get('/api/profile', api.profile);

/* main router for reactjs components, supporting both client and server side rendering*/
app.get('*', (req, res) => {
  match({ routes, location: req.url }, (err, redirectLocation, props) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (props) {
      const markup = renderToString(<RoutingContext {...props}/>);

      res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>KTS</title>
          <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,500' rel='stylesheet' type='text/css'>
        </head>

        <body>
          <div id="app">${markup}</div>
          <script src="/app.js"></script>
        </body>
      </html>
      `);

    } else {
      res.sendStatus(404);
    }
  });
});

// app-wide stuff
app.logger = logger;
app.config = config;

const server = http.createServer(app);

server.listen(PORT);
server.on('listening', () => {
  logger.info('Listening on', PORT);
});
