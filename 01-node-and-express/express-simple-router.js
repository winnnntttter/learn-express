const express = require('express');
const app = express();

app.set('port',process.env.PORT || 3000);

//设置环境变量的PORT：linux只设置一次有效 $ PORT=1234 node a.js
//永久有效  $ export PORT=1234
//windows下只能设置永久有效 set PORT=1234(cmd有效，powershell无效，不相通)


//主页
app.get("/",(req,res)=>{
  res.type('text/plain');
  res.send('Welcome to the index');
});
//about页
app.get('/about',(req,res)=>{//不写req，和res会发生500错误，请求不存在的地址404错误
  res.type('text/html');
  res.send('Welcome to the about');
});

//定制404页面
app.use((req,res,next)=>{
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

//定制500页面 程序运行错误
app.use((err,req,res,next)=>{
  console.error(err);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
});

/* app.get('/',(req,res)=>{
  //res.type('text/plain');
  res.send('Hello World');//或者{'msg':'hello world'},此时默认响应头的Content-Type为application/json;
});
app.listen(3000); */

app.listen(app.get('port'), () => {
  console.log(`App listening on port ${app.get('port')}!`);
});