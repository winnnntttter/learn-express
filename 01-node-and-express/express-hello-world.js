const express = require('express');
const app = express();

app.get(['/','/index'],(req,res)=>{
  //res.type('text/plain');
  res.send('Hello World');//或者{'msg':'hello world'},此时默认响应头的Content-Type为application/json;
});
app.listen(3000);

console.log('Server is running on localhost:3000;press ctrl+c to stop.');