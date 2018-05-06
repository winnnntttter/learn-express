//request对象

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
const staff = {
  beijing:{
    li:{like:'reading'},
    wang:{like:'writing'},
  },
  shanghai:{
    zhang:{like:'watching'}
  }
};

const staff2 = [
  {
    city:"beijing",
    name:"li",
    like:["reading","eating"]
  },
  {
    city:"beijing",
    name:"wang",
    like:["writing","reading"]
  }
];


app.get('/staff3',(req, res, next)=>{
  res.type('text/html');
  res.send('<form action="/staff3" method="post"><input name="beijing"><button type="submit">提交</button></form>');
});

app.post('/staff3', (req, res, next) => {          //使用表单提交，不需要添加app.use(bodyParser.json());，需添加app.use(bodyParser.urlencoded({ extended: false}))
  console.log(req.body);

  for(let i in req.body){
    const jsonTemp = JSON.parse(req.body[i]);//传json格式value：{"zhao":{"like":"listening"}}
    if(staff[i]){
      Object.assign(staff[i],jsonTemp);
    }else{
      staff[i] = jsonTemp;
    }
  }
  res.json(staff);
});


app.get('/staff2list',(req,res)=>{
  let table = '<table border="1" style="border:1px solid #666; border-collapse: collapse;"><tr><td>name</td><td>city</td><td>like</td></tr>';
  for(let i in staff2){
    table += '<tr><td>' + staff2[i].name + '</td><td>' +  staff2[i].city + '</td><td>' + (staff2[i].like instanceof Array ? staff2[i].like.join(", ") : staff2[i].like) + '</td></tr>';
  }
  res.send(table);
});

app.get('/staff2',(req, res, next)=>{
  res.type('text/html');
  res.send('<form action="/staff2" method="post">城市：<input name="staff[0][city]">姓名：<input name="staff[0][name]">爱好：<label>读<input type="checkbox" name="staff[0][like]" value="reading"></label><label>写<input type="checkbox" name="staff[0][like]" value="writing"></label><label>吃<input type="checkbox" name="staff[0][like]" value="eating"></label><br>城市：<input name="staff[1][city]">姓名：<input name="staff[1][name]">爱好：<label>读<input type="checkbox" name="staff[1][like]" value="reading"></label><label>写<input type="checkbox" name="staff[1][like]" value="writing"></label><label>吃<input type="checkbox" name="staff[1][like]" value="eating"></label><br><button type="submit">提交</button></form>');
});//extended需设置为true

app.post('/staff2', (req, res, next) => {
  console.log(req.body);
  //staff2 = staff2.concat(req.body.staff);
  for(let i in req.body.staff){
    staff2.push(req.body.staff[i]);
  }
  //res.json(staff2);
  res.redirect(303,'/staff2list');
});


//404页面
app.use((req,res,next)=>{
  res.type('text/plain');
  //res.status(404);
  //res.send('404 - Not Found，未设置此页面的路由。');
  res.send('404','<h3>404 - Not Found，未设置此页面的路由。</h3>');
});

//500页面 程序运行错误
app.use((err,req,res,next)=>{
  console.error(err);
  res.type('text/plain');
  //res.status(500);
  //res.send('500 - Server Error，这是程序内部错误，请检查代码。');
  res.send('500','500 - Server Error，这是程序内部错误，请检查代码。');  
});

app.listen(3000);

console.log('Server is running on localhost:3000;press ctrl+c to stop.');