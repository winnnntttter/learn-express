//request对象

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));//不添加则表单提交的数据无效 extended 为false时不能正确的解析复杂对象（多级嵌套）

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

app.get('/staff/:city',(req,res)=>{
  console.log(req.query);
  if(!staff[req.params.city]){
    console.log("ooh, city not found");
    res.send(`ooh, city ${req.params.city} not found`);
    //return next();
  }else{
    if(req.query.name){
      if(staff[req.params.city][req.query.name]){
        let like = staff[req.params.city][req.query.name].like;
        res.send(`${req.query.name} form ${req.params.city} like ${like}`);
      }else{
        res.send(`There is no man named ${req.query.name}`);
      }
    }else{
      let str = "";
      for(let i in staff[req.params.city]){
        str += i + " like " + staff[req.params.city][i].like +"<br>";
      }
      res.send(str);
    }
  }
});

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

app.post('/staff', (req, res,next) => {         //需要添加app.use(bodyParser.json());使用curl提交
  for(let i in req.body){
    if(staff[i]){
      Object.assign(staff[i],req.body[i]);
    }else{
      staff[i] = req.body[i];
    }
  }
  console.log(staff);
  res.json(staff);
});


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
  res.json(staff2);
});

app.use((req,res,next)=>{
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.listen(3000);

console.log('Server is running on localhost:3000;press ctrl+c to stop.');