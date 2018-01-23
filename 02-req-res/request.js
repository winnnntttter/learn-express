//request对象

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const staff = {
  beijing:{
    li:{like:'reading'},
    wang:{like:'writing'},
  },
  shanghai:{
    zhang:{like:'watching'}
  }
};

app.get('/staff/:city/:name',(req,res,next)=>{
  console.log(req.params);//{ city: 'beijing', name: 'li' }

  console.log(req.query);//http://localhost:3000/staff/beijing/li?aa=1&bb=2时为{ aa: '1', bb: '2' }

  let like = staff[req.params.city][req.params.name].like;
  if(!like){
    console.log("ooh,not found");
    return next();
  }
  res.send(`${req.params.name} form ${req.params.city} like ${like}`);
});

app.post('/staff', (req, res,next) => {
  for(let i in req.body){
    if(staff[i]){
      Object.assign(staff[i],req.body[i]);
    }else{
      staff[i] = req.body[i];
    }
  }
  console.log(staff);
  res.send(staff);
});

app.use((req,res,next)=>{
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.listen(3000);

console.log('Server is running on localhost:3000;press ctrl+c to stop.');