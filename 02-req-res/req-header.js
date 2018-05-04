//请求报头

const express = require('express');
const app = express();

app.get('/',(req,res)=>{
  res.set('Content-Type','text/html');
  let q = '',s = '';
  for(let i in req.headers){
    q += i + ':' + req.headers[i] + '<br>';
  }
  for(let i in res._headers){
    s += i + ':' + res._headers[i] + '<br>';
  }
  console.log(req);
  console.log(res);
  res.send(q+s);
});
app.listen(3000);

console.log('Server is running on localhost:3000;press ctrl+c to stop.');