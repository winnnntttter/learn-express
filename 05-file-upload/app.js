const fs = require('fs');//引入文件处理系统
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const app = express();

const dataDir = __dirname + '/data';
const photoDir = dataDir + '/photo';
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(photoDir) || fs.mkdirSync(photoDir);

let store = {};
store.accounts = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set("view cache",false);
app.use('/public',express.static('public'));
app.use('/data',express.static('data'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'data')));
app.get('/add', (req, res) => {
  res.render('add');
});

app.get('/list', (req, res) => {
  let accounts = store.accounts;
  res.render('list',{accounts});
});

app.post('/add', (req, res,next) => {
  //let newAccount = req.body;                  //req.body不好用了
  //newAccount.id = store.accounts.length + 1;
  //store.accounts.push(newAccount);

  let form = new formidable.IncomingForm();
  form.parse(req,(err,fields,files)=>{
    if(err) return res.redirect(303,'/error');
    let photo = files.photo;
    let dataNow = Date.now();
    let dir = photoDir + '/' + dataNow;
    let photoPath = dir + '/' + photo.name;
    fs.mkdirSync(dir);
    //fs.renameSync(photo.path,dir + '/' + photo.name);//跨磁盘，无法操作的错误提示cross-device link not permitted
    let readStream=fs.createReadStream(photo.path);
    let writeStream=fs.createWriteStream(dir + '/' + photo.name);
    readStream.pipe(writeStream);
    readStream.on('end',function(){
      fs.unlinkSync(photo.path);
    });

    let newAccount = fields;
    newAccount.id = store.accounts.length + 1;
    newAccount.path = '/data/photo/' + dataNow + '/' + photo.name;
    store.accounts.push(newAccount);
    //console.log(fields);//非文件对象集合
    //console.log(files);//文件对象集合
    res.redirect(303,'/list');//重定向到list页
  });
});

app.use((req,res,next)=>{
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use((err,req,res,next)=>{
  console.error(err);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
});
app.listen(3000);

console.log('Server is running on localhost:3000;press ctrl+c to stop.');