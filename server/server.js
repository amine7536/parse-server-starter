import path from 'path';
import express from 'express';
import Parse from 'parse/node';
import { ParseServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';

const SERVER_PORT = process.env.PORT || 8080;
const SERVER_HOST = process.env.HOST || 'localhost';
const APP_ID = process.env.APP_ID || 'sample-app';
const MASTER_KEY = process.env.MASTER_KEY || 'c7ad3d70c6093dba5a7e55968a1d3e5a74ef5cac';
const FILE_KEY = process.env.FILE_KEY || 'f33f9ba9-c1a9-4589-9976-95cac0d52cd5';
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/dev';
const DASHBOARD_AUTH = process.env.DASHBOARD_AUTH;

Parse.initialize(APP_ID);
Parse.serverURL = `http://localhost:${SERVER_PORT}/parse`;
Parse.masterKey = MASTER_KEY;
Parse.Cloud.useMasterKey();

const server = express();

/**
 * [ParseServer description]
 * @param databaseURI: DATABASE_URI
 * @param cloud: Cloud Code file
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
  allowInsecureHTTP: 1,
  apps: [
    {
      serverURL: '/parse',
      appId: APP_ID,
      masterKey: MASTER_KEY,
      appName: 'photogram-codeur-com',
    },
  ],
});

server.use('/dashboard', dashboard);

server.listen(SERVER_PORT, () => console.log(
  `Server is now running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${SERVER_PORT}`
));
