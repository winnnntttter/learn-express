## 一、Express简介

#### 1.1 基本概念
  
  - Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时。 Node.js 使用高效、轻量级的事件驱动、非阻塞 I/O 模型。它的包生态系统，npm，是目前世界上最大的开源库生态系统。

  - Express是一个基于 Node.js 平台，快速、开放、极简的 web 开发框架， 提供了一系列强大特性帮助创建各种 Web 应用，和丰富的 HTTP 工具。使用 Express 可以快速地搭建一个完整功能的网站。

#### 1.2 特点
  
  - Node.js 优点：
    - 异步、事件驱动、为网络服务而设计、语言统一。
    - Node.js非阻塞模式的IO处理给Node.js带来在相对低系统资源耗用下的高性能与出众的负载能力，非常适合用作依赖其它IO资源的中间层服务
    - Node.js轻量高效，可以认为是数据密集型分布式部署环境下的实时应用系统的完美解决方案。node非常适合如下情况：在响应客户端之前，预计可能有很高的流量，但所需的服务器端逻辑和处理不一定很多

  - Node.js 缺点：
    - 单进程，单线程，只支持单核CPU，不能充分的利用多核CPU服务器。一旦这个进程崩掉，那么整个web服务就崩掉了
  
  - Express：更简洁的API、中间件、和路由让程序的组织管理变的更加容易、可拓展性强

#### 1.3 适用场景

  - I/O密集型高并发

  - JSON APIs——构建一个REST/JSON API服务，Node.js可以充分发挥其非阻塞IO模型以及JavaScript对JSON的功能支持(如JSON.stringfy函数)

  - 单页面、多Ajax请求应用——如Gmail，前端有大量的异步请求，需要服务后端有极高的响应速度


#### 1.4 不适用

  - CPU使用率较重、IO使用率较轻的应用——如视频编码、人工智能等，Node.js的优势无法发挥


## 二、安装及运行
  - 安装node
  - 安装Express  
     
    ```
    $ npm init -y生成package.json
    $ npm i express --save安装express，并保存到package.json
    ```
    或者直接使用生成器express-generator
    ```
    $ npm i express-generator -g
    $ express myapp （-e使用ejs引擎，默认为jade）
    $ cd myapp 
    $ npm i
    ```
  - 运行

    ```
    $ node index.js
    ```
## 三、Node.js和Express的简单比较
  - node实现Hello World
  
    ```
    const http = require('http');
    http.createServer((req,res)=>{                      // 无路由信息localhost:3000下所有路径均指向Hello World
      res.writeHead(200,{'Content-Type':'text/html'});  //需要指定响应状态和响应类型
      res.end('Hello World');
    }).listen(3000);

    console.log('Server is running on localhost:3000;press ctrl+c to stop.');

    //指定路由：
    var http = require('http');
    http.createServer(function(req,res){
    var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
      switch(path) {
        case '':
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Homepage');
          break;
        case '/about':
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('About');
          break;
        default:
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
          break;
      }
    }).listen(3000);

    console.log('Server started on localhost:3000; press Ctrl-C to terminate....');
    ```
  
  - Express实现Hello World
  
    ```
    const express = require('express');
    const app = express();

    app.get('/index',(req,res)=>{               //包含路由信息，只有localhost:3000/index能访问
      res.send('Hello World');
    }).listen(3000);

    console.log('Server is running on localhost:3000;press ctrl+c to stop.');
    ```

  - Express核心特性

    - 可以设置中间件来响应 HTTP 请求。

    - 定义了路由表用于执行不同的 HTTP 请求动作。

    - 可以通过向模板传递参数来动态渲染 HTML 页面。

  - Express优势

    - 丰富的 HTTP 快捷方法和中间件。

    - 性能良好：express 不对 Node.js 已有的特性进行二次抽象，只是在它之上扩展了 Web 应用所需的基本功能。

    - 生态成熟，资源丰富