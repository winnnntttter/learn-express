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
  //next();
  res.send('thanks, all over');//在此处终止，返回数据，但如果上面加了next()，还是会传递下去，会抛异常，如果next()放下面，则抛异常不会执行下去
  
});

app.use((req, res, next) => {
  next();
  console.log('never will be called');//不会执行
});
app.use( (req, res)=> {                               
  console.log(' 未处理的路由 ');
  res.send('404 - 未找到 ');
});
app.listen(app.get('port'));
console.log(`Server is running on localhost:${app.get('port')};press ctrl+c to stop.`);