/**
 * Module dependencies.
 */

const express = require('express');
const path = require('path');
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const site = require('./routes/site');
const post = require('./routes/post');
const user = require('./routes/user');
const test = require('./routes/test');

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

// General

app.get('/', site.index);

// User

app.get('/users', user.list);
app.all('/user/:id/:op?', user.load);
app.get('/user/:id', user.view);
app.get('/user/:id/view', user.view);
app.get('/user/:id/edit', user.edit);
app.put('/user/:id/edit', user.update);

// Posts

app.get('/posts', post.list);

//test
app.get('/about', test.about);
app.get('/ab?cd', test.abcd);
app.get(/.*fly$/, test.fly);
app.get('/example/d', [test.cb0,test.cb1], (req, res)=> {
  res.send('Hello from D!');
});
app.route('/book')
  .get(test.getBook)
  .post(test.postBook)
  .put(test.putBook);

  //curl -X POST "http://localhost:3000/book"
  //curl -X PUT "http://localhost:3000/book"

app.get('/special',test.getSpecials,test.renderSpecials);


if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
