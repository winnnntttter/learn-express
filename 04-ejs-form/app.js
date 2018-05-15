const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();


const storeData = fs.readFileSync(path.join(__dirname, 'public/data/data.json'), "utf8")
  .replace(/\r?\n|\r/g,'\n');

let store = {};
store.accounts = JSON.parse(storeData);

app.use(session({
  secret: "12345"
}));

//使用flash消息
app.use(flash());

app.use((req, res, next)=>{
  res.locals.flash_success_message = req.flash('flash_success_message'); 
  res.locals.flash_error_message = req.flash('flash_error_message');        
  next();
});


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

//支持put和delete
app.use(methodOverride('_method'));

//form表单添加页
app.get('/user', (req, res) => {
  let bindError = {};
  let user = {
    name: '',
    like: ''
  };
  res.render('add',{bindError,user});
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

app.post('/user', (req, res, next) => {
  let newAccount = req.body;
  newAccount.id = parseInt(Math.random()*1000000000).toString();
  let bindError = {};
  let user = req.body;
  if (req.xhr || req.accepts('json,html')==='json') {//ajax提交的处理方法
    if(req.body.name.indexOf('S')>=0){
      res.json({'result':false,'message':'Sorry, You cant have a name include S.'});
    }else{
      store.accounts.push(newAccount);
      console.log(store);
      fs.writeFileSync(path.join(__dirname, 'public/data/data.json'),JSON.stringify(store.accounts,null,4));
      res.json({'result':true,'message':'success!'});
    }
  }else{
    if(req.body.name.indexOf('S')>=0){
      bindError.nameErr = 'Sorry, You cant have a name include S.';
      res.render('add',{bindError,user});
    }else{
      store.accounts.push(newAccount);
      console.log(store);
      fs.writeFileSync(path.join(__dirname, 'public/data/data.json'),JSON.stringify(store.accounts,null,4));

      res.redirect(303,'/list');//重定向到list页
    }
  }
});

app.get('/user/:id', (req, res)=>{
  let tempId = req.params.id;
  let account, flag = false;
  store.accounts.forEach((element,index) => {
    if (element.id == req.params.id) {
      account = element;
      flag = true;
    }
  });
  if (flag === false) throw new Error('Not Found');
  res.render('edit',{account});
});

app.put('/user', (req, res) =>{
  store.accounts.forEach((element,index) => {
    if (element.id == req.body.id) {
      element.name = req.body.name;
      element.like = req.body.like;
    }
  });
  fs.writeFileSync(path.join(__dirname, 'public/data/data.json'),JSON.stringify(store.accounts,null,4));
  res.redirect(303,'/list');
});

app.delete('/user', (req, res) =>{
  let flag = false;
  store.accounts.forEach((element,index) => {
    if (element.id == req.body.id) {
      store.accounts.splice(index,1);
      flag = true;
    }
  });
  fs.writeFileSync(path.join(__dirname, 'public/data/data.json'),JSON.stringify(store.accounts,null,4));
  if (req.xhr || req.accepts('json,html')==='json') {
    if(flag === true){
      res.json({'result':true,'message':'success!'});
    }else{
      res.json({'result':false,'message':'fail!'});
    }
  }else{
    if(flag === true){
      req.flash('flash_success_message', '删除成功！');
    }else{
      req.flash('flash_error_message', '删除失败！');
    }
    res.redirect(303,'/list');//重定向到list页
  }
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