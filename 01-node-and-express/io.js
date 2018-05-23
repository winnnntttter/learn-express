const fs = require("fs");
fs.readFile(`${__dirname}/node-hello-world.js`, "utf8", (error, file)=> {  
     if (error) throw error;  
     console.log("我读完文件了！");
});
console.log("我不会被阻塞！");