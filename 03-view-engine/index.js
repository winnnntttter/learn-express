//ejs模板

const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');

//识别ejs代码
app.set('view engine','ejs');

//设置模板目录
app.set('views', path.join(__dirname, 'views')); //__dirname:当前文件所在目录的完整目录名，__filename变量获取当前模块文件的带有完整绝对路径的文件名

//挂载静态资源处理中间件,识别css样式,不引入将不知道外部样式表
app.use('/assets',express.static(path.join(__dirname, 'assets')));


  //cd 到03-view-engine后可以使用下面两个方法,不用__dirname
  //app.set('views','views');
  //app.use('/assets',express.static('assets'));
  //app.use(express.static(path.join(__dirname, 'assets'))); //未设置虚拟目录，此时引用css：href="/style.css"或href="./style.css"


const data={
  name : 'Bruce',
  sex : '男',
  content : '参数，可以更改'
};

const staff=[
  {
    name: 'A',
    age: '20',
    like: ['reading','eating']
  },
  {
    name: 'B',
    age: '18',
    like: 'listening'
  }
];

//app.set('view options', {delimiter: '?',cache:true,filename:'index'});
//交互
app.get('/',(req, res)=>{
  res.render('index',data); //对象可直接引用其属性
});

app.get('/list',(req, res)=>{
  res.render('list',{staff}); //数组加{}
});


app.listen(3000);

console.log('Server is running on localhost:3000;press ctrl+c to stop.');