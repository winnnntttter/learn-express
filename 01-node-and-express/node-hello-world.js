const http = require('http');
http.createServer((req,res)=>{
  res.writeHead(200,{'Content-Type':'text/html'});
  res.end('Hello World');
}).listen(3000);

console.log('Server is running on localhost:3000;press ctrl+c to stop.');