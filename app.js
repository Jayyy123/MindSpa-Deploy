require('dotenv').config();
const { getLocalPath } = require('./core/helpers');
const express = require('express');
const cookieParser = require('cookie-parser');
const controllersEndpoints = require('./controllers/index');
const portalsEndpoints = require('./routes/index');
const db = require('./models');
const logger = require('morgan');
const expressSession = require("express-session");
const SessionStore = require("express-session-sequelize")(expressSession.Store);
const cors = require('cors');

let app = express();
app.set('iocContainer', process.env);
app.set('db', db);
app.use(logger('dev'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: false, limit: '100mb' }));
app.use(express.json());
app.use(cors());
app.set('trust proxy', 1);
const sequelizeSessionStore = new SessionStore({
  db: db.sequelize,
});
let session = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  store: sequelizeSessionStore,
  saveUninitialized: false,
  // name: "session",
  // proxy: true,
  // cookie: { maxAge: 60 * 60 * 1000 },
};
app.set('trust proxy', true)
app.use(expressSession(session));
app.use(cookieParser());
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
});
controllersEndpoints(app, db);
app.get('/', (req, res, next) => {
  return res.send("<h1 style='text-align:left;'>Mind Spa Api is Live</h1>");
});

app.use((req, res, next) => {
  return res.status(404);
});

module.exports = app;
