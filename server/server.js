import path from 'path';
import express from 'express';
import winston from 'winston';
import expressWinston from 'express-winston';
import Parse from 'parse/node';
import { ParseServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';

/**
 * Parse-Server configuration variables
 */
const SERVER_PORT = process.env.PORT || 8080;
const SERVER_HOST = process.env.HOST || 'localhost';
const APP_ID = process.env.APP_ID || 'YOUR_APPLICATION_ID';
const APP_NAME = process.env.APP_NAME || 'YOUR_APPLICATION_NAME';
const MASTER_KEY = process.env.MASTER_KEY || 'YOUR_MASTER_KEY_HERE';
const FILE_KEY = process.env.FILE_KEY || 'YOUR_FILE_KEY_HERE';
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/dev';
const DASHBOARD_START = process.env.DASHBOARD_START || true;
const DASHBOARD_AUTH = process.env.DASHBOARD_AUTH || 'user:changeme';
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS || 'no-reply@parseapps.com';
const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN || 'parseapps.com';
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || 'YOUR_MAILGUN_API_KEY_HERE';
const PUSH_IOS_PFX = process.env.PUSH_IOS_PFX || '/certs/dev-pfx.p12';
const PUSH_IOS_PFX_PASSPHRASE = process.env.PUSH_IOS_PFX_PASSPHRASE || '';
const PUSH_IOS_BUNDLEID = process.env.PUSH_IOS_BUNDLEID || 'YOUR_APP_BUNDLE_ID';
const PUSH_IOS_MODE = process.env.PUSH_IOS_MODE || false;


Parse.initialize(APP_ID);
Parse.serverURL = `http://localhost:${SERVER_PORT}/parse`;
Parse.masterKey = MASTER_KEY;
Parse.Cloud.useMasterKey();

const server = express();

// Serve static assets from the /public folder
server.use('/public', express.static(path.join(__dirname, '/public')));

/**
 * [winston logger]
 */
const logger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      // json: true,
      colorize: true,
    }),
  ],
});
server.use(logger);

/**
 * [ParseServer]
 */
const api = new ParseServer({
  /* General config */
  databaseURI: DATABASE_URI,
  cloud: process.env.CLOUD_CODE_MAIN || path.resolve(__dirname, 'cloud.js'),
  appId: APP_ID,
  appName: APP_NAME,
  masterKey: MASTER_KEY,
  fileKey: FILE_KEY,
  serverURL: `http://${SERVER_HOST}:${SERVER_PORT}/parse`,
  verifyUserEmails: false,

  /* Email Adapter */
  emailAdapter: {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      fromAddress: EMAIL_FROM_ADDRESS,
      domain: EMAIL_DOMAIN,
      apiKey: MAILGUN_API_KEY,
    },
  },

  /* Push Config */
  push: {
    ios: {
      pfx: PUSH_IOS_PFX,
      passphrase: PUSH_IOS_PFX_PASSPHRASE,
      bundleId: PUSH_IOS_BUNDLEID,
      production: PUSH_IOS_MODE,
    },
  },
});
server.use('/parse', api);

/**
 * Enbale Dashboard
 */
if (DASHBOARD_START) {
  let users = [];
  if (DASHBOARD_AUTH) {
    const [user, pass] = DASHBOARD_AUTH.split(':');
    users = [{ user, pass }];
    console.log(users);
  }

  /**
   * [ParseDashboard]
   */
  const dashboard = new ParseDashboard({
    users,
    allowInsecureHTTP: false,
    apps: [
      {
        serverURL: '/parse',
        appId: APP_ID,
        masterKey: MASTER_KEY,
        appName: 'sample-app',
      },
    ],
  }, DASHBOARD_START);
  server.use('/dashboard', dashboard);
}

/**
 * [winston errorLogger]
 */
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      // json: true,
      colorize: true,
    }),
  ],
});
server.use(errorLogger);

server.listen(SERVER_PORT, () => console.log(
  `Server is now running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${SERVER_PORT}`
));
