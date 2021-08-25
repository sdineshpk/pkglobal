import * as express from 'express';
import * as path from 'path';
import {routes} from './api-routes/app.routes';
import * as OpenApiValidator from 'express-openapi-validator';
import * as log4js from 'log4js';
import session = require('express-session');
import { ExpressOIDC } from '@okta/oidc-middleware';
import * as cors from 'cors';
import * as mongoose from "mongoose";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

// session support is required to use ExpressOIDC
app.use(session({
  secret: 'this should be secure',
  resave: true,
  saveUninitialized: false
}));

const oidc = new ExpressOIDC({
  appBaseUrl:'http://localhost:3333',
  issuer: 'https://dev-88273664.okta.com/oauth2/default',
  client_id: '0oa1h0uljcJ5FhQMd5d7',
  client_secret: 'FaZHabf6fK4v9JUdC8L944F3qHoCgBURGfzxwlOr',
  redirect_uri: 'http://localhost:3333/authorization-code/callback',
  scope: 'openid profile'
});

// ExpressOIDC attaches handlers for the /login and /authorization-code/callback routes
app.use(oidc.router);

//Logger
const log = log4js.getLogger("app");
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

const spec = path.join(__dirname+"../../../../apps/book-api/", 'api.yaml');

app.use('/spec', express.static(spec));
app.use(
  OpenApiValidator.middleware({
    apiSpec: spec,
    validateRequests: true, // <-- to validate request
    validateResponses: true,
  }),
);

app.use('/',routes);

app.use((err, req, res, next) => {
  log.error("Something went wrong:", err);
  res.status(err.status || 500).json({
    message: err.message,
    error: err.stack,
  });
});

//mongoDb connection
const databaseUser=process.env.DB_USER;
const databasePass=process.env.DB_PASSWORD;
const databaseName=process.env.DB_NAME;
const uri = `mongodb+srv://${databaseUser}:${databasePass}@cluster0.wwxsa.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

const options:mongoose.ConnectOptions={
    useCreateIndex:true,
    useFindAndModify:true
};

const port = process.env.port || 3333;

mongoose.connect(uri,options, (err) => {
  if (err) {
    log.error('Mongoose Connection',err);
  } else {
    log.debug("Successfully Connected!");
    console.log("Successfully Connected!");
    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
      log.debug(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', log.error);
  }
});



