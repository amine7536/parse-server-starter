import path from 'path';
import express from 'express';
import winston from 'winston';
import expressWinston from 'express-winston';
import Parse from 'parse/node';
import { ParseServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';

const SERVER_PORT = process.env.PORT || 8080;
const SERVER_HOST = process.env.HOST || 'localhost';
const APP_ID = process.env.APP_ID || 'YOUR_APPLICATION_ID';
const MASTER_KEY = process.env.MASTER_KEY || 'YOUR_MASTER_KEY_HERE';
const FILE_KEY = process.env.FILE_KEY || 'YOUR_FILE_KEY_HERE';
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/dev';
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const DASHBOARD_AUTH = process.env.DASHBOARD_AUTH || 'user:changeme';

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
  databaseURI: DATABASE_URI,
  cloud: process.env.CLOUD_CODE_MAIN || path.resolve(__dirname, 'cloud.js'),
  appId: APP_ID,
  masterKey: MASTER_KEY,
  fileKey: FILE_KEY,
  serverURL: `http://${SERVER_HOST}:${SERVER_PORT}/parse`,
});
server.use('/parse', api);

/**
 * Enbale Dashboard during development
 */
if (IS_DEVELOPMENT) {
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
    allowInsecureHTTP: true,
    apps: [
      {
        serverURL: '/parse',
        appId: APP_ID,
        masterKey: MASTER_KEY,
        appName: 'sample-app',
      },
    ],
  }, IS_DEVELOPMENT);
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
