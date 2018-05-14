
const express = require('express');
const fs = require('fs');
const FileStreamRotator = require('file-stream-rotator');
const logger = require('morgan');
const app = express();

app.use(logger('dev'));//在控制台输出日志

//const accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
//app.use(logger('combined', {stream: accessLogStream}));


//按日期分文件
const logDirectory = __dirname + '/log';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: logDirectory + '/%DATE%.log',
    frequency: 'daily',
    verbose: false
});
app.use(logger('combined', {stream: accessLogStream}));


app.use( (req, res, next)=> {
  console.log('\n\nALLWAYS');
  next();
});
app.get('/a',  (req, res)=> {
  console.log('/a: 路由终止 ');
  res.send('a');
});
app.use('/a',  (req, re, next)=> {
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
app.get('/c',  (req, res)=> {
  console.log('/c: 抛出错误 ');
  throw new Error('c 失败 ');
});
app.use('/c',  (err, req, res, next)=> {
  console.log('/c: 检测到错误但不传递 ');
  next();
});


app.get('/user/:id', (req, res, next)=> {
  // 如果 user id 为 0, 跳到下一个路由
  if (req.params.id === '0') next('route');
  // 否则将控制权交给栈中下一个中间件
  else next(); //
}, (req, res, next)=> {
  // 常规页面
  res.send('regular');
});

// 处理 /user/:id， 特殊页面
app.get('/user/:id', (req, res, next)=> {
  res.send('special');
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