const fs = require("fs");

console.log(`异步读取开始：${new Date().getTime()}`);

fs.readFile(`${__dirname}/package-lock.json`, "utf8", (error, file)=> {  
     if (error) throw error;  
     console.log(`异步读取结束：${new Date().getTime()}`);
});

console.log(`同步读取开始：${new Date().getTime()}`);

const data = fs.readFileSync(`${__dirname}/package-lock.json`, "utf8");

console.log(`同步读取结束：${new Date().getTime()}`);
