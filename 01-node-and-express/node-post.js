const http = require('http');

http.createServer((req,res)=>{

  if(req.method=='POST'){
    let buff = '',
      c = 0;
    req.on('data',(chunk)=>{
      buff += chunk;
      c++;
    });
    req.on('end',()=>{
      console.log(`Body:${buff}, ${c}`);
      res.statusCode = 200;
      res.end(buff);
    });
  }else{
    res.writeHead(200,{'Content-Type':'text/plain'})
    res.end('Hello World');
  }
}).listen(3000);

console.log('Server is running on localhost:3000;press ctrl+c to stop.');
//curl -H 'Content-Type: application/json' -X POST -d '{"paris":{"jojo":{"like":"fighting"}}}' "http://localhost:3000/staff" -i