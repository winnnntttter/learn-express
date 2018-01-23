//ejs模板

const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');

//识别ejs代码
app.set('view engine','ejs');

//识别css样式,不引入将不知道外部样式表
app.use('/assets',express.static('assets'));

var data={
  name : 'Bruce',
  sex : '男',
  content : '参数,可以更改'
};

//交互
app.get('/',function (req, res) {
    res.render('index',data);
});

app.listen(3000);

console.log('Server is running on localhost:3000;press ctrl+c to stop.');