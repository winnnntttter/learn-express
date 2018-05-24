const http = require('http');
const fs = require('fs');
const path = require('path');
const uuidV1 = require('uuid/v1');

const fetchPage = (urlF,callback) =>{
  http.get(urlF,(response)=>{
    let buff = '',
      c = 0;
    response.on('data',(chunk)=>{
      buff +=chunk;
      c++;
    });
    response.on('end',()=>{
      console.log(c);
      callback(null,buff);
    });
    response.on('error',(error)=>{
      console.error(`Got error1:${error.message}`);
    });
  }).on('error',(error)=>{
    console.error(`Got error2:${error.message}`);
    callback(error);
  });
};

const downloadPage = (url = 'http://www.baidu.com') =>{
  console.log('downloading',url);
  
  const folderName = uuidV1();
  fs.mkdirSync(folderName);
  fetchPage(url,(error,data)=>{
    if(error) console.error(error);
    fs.writeFileSync(path.join(__dirname,folderName,'url.txt'),url);
    fs.writeFileSync(path.join(__dirname,folderName,'url.html'),data);
    console.log('downloading is done in folder',folderName);
  })
}

downloadPage(process.argv[2]);