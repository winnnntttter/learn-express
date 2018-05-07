const express = require('express');
const app = express();
const path = require('path');

//演示使用静态文件方式返回静态html
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/something',express.static(path.join(__dirname, 'assets/html')));

//模板实现原理：

const tpl = "Hello {{visitorname}}, Welcome to {{worldname}}!";
const data = {
  visitorname: "aaa",
  worldname: "usa"
};
const pattern = /{{([\s\S]+?)}}/gi;
const result = tpl.replace(pattern, (match, tuple)=>{
  return data[tuple];
});

app.get('/index',(req,res)=>{
  res.send(result);
});


app.listen(3000);

console.log('Server is running on localhost:3000;press ctrl+c to stop.');