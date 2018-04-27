//request对象

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));//不添加则表单提交的数据无效

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
    like:"reading"
  },
  {
    city:"beijing",
    name:"wang",
    like:"writing"
  }
];


app.get('/staff/:city/:name',(req,res,next)=>{
  console.log(req.params);//{ city: 'beijing', name: 'li' }

  console.log(req.query);//http://localhost:3000/staff/beijing/li?aa=1&bb=2时为{ aa: '1', bb: '2' }

  //console.log(req.route);

  if(!staff[req.params.city]){
    console.log("ooh, city not found");
    res.send("ooh, city not found");
    //return next();
  }else if(!staff[req.params.city][req.params.name]){
    console.log("ooh, people not found");
    res.send("ooh, people not found");
    //return next();
  }else{
    let like = staff[req.params.city][req.params.name].like;
    res.send(`${req.params.name} form ${req.params.city} like ${like}`);
  }
});

app.get('/staff',(req, res, next)=>{
  res.type('text/html');
  res.send('<form action="/staff" method="post"><input name="beijing"><button type="submit">提交</button></form>');
});

app.post('/staff', (req, res, next) => {
  console.log(req.body);

  for(let i in req.body){
    const jsonTemp = JSON.parse(req.body[i]);//传json格式value
    if(staff[i]){
      Object.assign(staff[i],jsonTemp);
    }else{
      staff[i] = jsonTemp;
    }
  }
  res.json(staff);
});

app.get('/staff2',(req, res, next)=>{
  res.type('text/html');
  res.send('<form action="/staff2" method="post">城市：<input name="staff[0][city]">姓名：<input name="staff[0][name]">爱好：<input name="staff[0][like]"><br>城市：<input name="staff[1][city]">姓名：<input name="staff[1][name]">爱好：<input name="staff[1][like]"><br><button type="submit">提交</button></form>');
});//extended需设置为true

app.post('/staff2', (req, res, next) => {
  console.log(req.body);
  //staff2 = staff2.concat(req.body.staff);
  for(let i in req.body.staff){
    staff2.push(req.body.staff[i]);
  }
  res.json(staff2);
});

app.use((req,res,next)=>{
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.listen(3000);

console.log('Server is running on localhost:3000;press ctrl+c to stop.');