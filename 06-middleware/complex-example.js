
const express = require('express');
const logger = require('morgan');
const app = express();

app.use(logger('dev'));

app.use( (req, res, next)=> {
  console.log('\n\nALLWAYS');
  next();
});
app.get('/a',  (req, res)=> {
  console.log('/a: 路由终止 ');
  res.send('a');
});
app.get('/a',  (req, res)=> {
  console.log('/a: 永远不会调用 ');
});
app.get('/b',  (req, res, next)=> {
  console.log('/b: 路由未终止 ');
  next();
});
app.use( (req, res, next)=> {
  console.log('SOMETIMES');
  next();
});
app.use('/b',  (req, res, next)=> {
  console.log('对b路径的post请求也会经过这里');
  next();
});
app.get('/b',  (req, res, next)=> {
  console.log('/b (part 2): 抛出错误 ');
  throw new Error('b 失败 ');                        //err.message
});
app.use('/b',  (err, req, res, next)=> {
  console.log('/b 检测到错误并传递 ');
  next(err);
});
app.get('/c',  (err, req)=> {
  console.log('/c: 抛出错误 ');
  throw new Error('c 失败 ');
});
app.use('/c',  (err, req, res, next)=> {
  console.log('/c: 检测到错误但不传递 ');
  next();
});
app.use( (err, req, res, next)=> {                    //处理所有的错误，c未传递错误，进入不到这一步，而是到下一步
  console.log(' 检测到未处理的错误 : ' + err.message);
  //console.error(err);
  res.send('500 - 服务器错误 ');
});
app.use( (req, res)=> {                               
  console.log(' 未处理的路由 ');
  res.send('404 - 未找到 ');
});
app.listen(3000,  ()=> {
  console.log(' 监听端口 3000');
});
console.log(`Server is running on localhost:3000;press ctrl+c to stop.`);