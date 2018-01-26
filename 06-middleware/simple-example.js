const express = require('express');
const logger = require('morgan');
const app = express();

app.set('port',process.env.PORT || 3000);

app.use(logger('dev'));//日志中间件

app.use((req, res, next) => {
  console.log(`processing request for ${req.url} ....`);
  next();//如果没有next，则请求就会挂起，没有向客户端返回数据,浏览器一直转圈
});

app.use((req, res, next) => {
  console.log('termitaing request');
  res.send('thanks,all over');//在此处终止，返回数据
});

app.use((req, res, next) => {
  console.log('never will be called');//不会执行
});

app.listen(app.get('port'));
console.log(`Server is running on localhost:${app.get('port')};press ctrl+c to stop.`);