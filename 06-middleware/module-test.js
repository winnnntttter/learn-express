const express = require('express');
const logger = require('morgan');
const app = express();
const moduleTest = require('./lib/middleware-module');
//const {middleware1,middleware2,middleware3} = require('./lib/middleware-module');

app.use(logger('dev'));

app.use(moduleTest.middleware1);
app.use(moduleTest.middleware2);
app.use(moduleTest.middleware3);
app.use(moduleTest.checkUser);

/* app.use(middleware1);
app.use(middleware2);
app.use(middleware3); */

app.get('/a', (req, res) => {
  console.log(req.test);
  res.send(req.test);
});

app.listen(3000,  ()=> {
  console.log(' 监听端口 3000');
});
console.log(`Server is running on localhost:3000;press ctrl+c to stop.`);