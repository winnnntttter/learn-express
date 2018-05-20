/**
 * Module dependencies.
 */
const express = require('express');
const path = require('path');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const hash = require('pbkdf2-password')();
const session = require('express-session');
const route = require('./routes/route');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

if (!module.parent) {
  app.use(logger('dev'));
}

app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));

app.use((req, res, next)=>{
  let err = req.session.error;
  let msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

app.use(route);


if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}

module.exports = app;
