const express = require('express');
const router = express.Router();
const site = require('./site');
const post = require('./post');
const user = require('./user');
const manager = require('./manager')

// Index
router.get('/', site.index);

// User
router.get('/users', user.list);
router.all('/user/:id/:op?', user.load);
router.get('/user/:id', user.view);
router.get('/user/:id/view', user.view);
router.get('/user/:id/edit', user.edit);
router.put('/user/:id/edit', user.update);

// Posts
router.get('/posts', post.list);

// Manager
router.get('/signup',manager.signup);
router.post('/manager',manager.addManager);

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = router;