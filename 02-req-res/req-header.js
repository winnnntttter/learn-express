//请求报头

const express = require('express');
const app = express();

app.get('/',(req,res)=>{
  res.set('Content-Type','text/html');
  let s = '';
  for(let i in req.headers){
    s += i + ':' + req.headers[i] + '<br>';
  }
  res.send(s);
});
app.listen(3000);


// host:localhost:3000
// connection:keep-alive
// pragma:no-cache
// cache-control:no-cache
// upgrade-insecure-requests:1
// user-agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36
// accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
// accept-encoding:gzip, deflate, br
// accept-language:zh-CN,zh;q=0.9
// cookie:Hm_lvt_c4a4df028977b3b8cac92e28249256ea=1513755401; _ga=GA1.1.340221145.1504518922


console.log('Server is running on localhost:3000;press ctrl+c to stop.');