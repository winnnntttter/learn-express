/**
 * Module dependencies.
 */

const express = require('express');
const path = require('path');
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const route = require('./routes/route');
const birds = require('./routes/birds');

module.exports = app;

// Config

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* istanbul ignore next */
if (!module.parent) {
  app.use(logger('dev'));
}

app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/birds', birds);
app.use(route);
//app.use('/birds',route);此时所有路径前都要加一层/birds/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
