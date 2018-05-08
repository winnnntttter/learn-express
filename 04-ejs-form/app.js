const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();

//临时存储
let store = {};
store.accounts = [];

//设置模板视图的目录
app.set('views', path.join(__dirname, 'views'));

//设置模板引擎的格式即运用何种模板引擎
app.set('view engine', 'ejs');

//设置是否启用视图编译缓存，启用将加快服务器执行效率
app.set("view cache",false);

app.use('/public',express.static(path.join(__dirname, 'public')));

//日志中间件
app.use(logger('dev'));

//请求体处理
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//form表单添加页
app.get('/add', (req, res) => {
  res.render('add');
});

//ajax添加页
app.get('/add-ajax', (req, res) => {
  res.render('add-ajax');
});

//列表页
app.get('/list', (req, res) => {
  let accounts = store.accounts;
  res.render('list',{accounts});
});

app.post('/add', (req, res, next) => {
  let newAccount = req.body;
  newAccount.id = Math.random()*100000000;
  store.accounts.push(newAccount);
  console.log(store);
  if (req.xhr || req.accepts('json,html')==='json') {//ajax提交的处理方法
    res.json({'result':true,'message':'success!'});
  }else{
    //res.status(201).json(store);//此时提交成功显示store
    res.redirect(303,'/list');//重定向到list页
  }
});

app.put('/edit/:id', (req, res) =>{
  let tempId = req.params.id;
  store.accounts.forEach(element => {
    if (condition) {
      
    }
  });
});

//定制404页面
app.use((req,res,next)=>{
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

//定制500页面
app.use((err,req,res,next)=>{
  console.error(err);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
});
app.listen(3000);

console.log('Server is running on localhost:3000;press ctrl+c to stop.');