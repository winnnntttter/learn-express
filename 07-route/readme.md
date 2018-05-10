## 一、路由基础
#### 1.1 基本概念
路由是指如何定义应用的端点（URIs）以及如何响应客户端的请求。
路由是由一个 URI、HTTP 请求（GET、POST等）和若干个句柄组成，它的结构如下： app.METHOD(path, [callback...], callback)， app 是 express 对象的一个实例， METHOD 是一个 HTTP 请求方法， path 是服务器上的路径， callback 是当路由匹配时要执行的函数。
  ```
  app.get('/', (req, res)=>{
    res.send('hello world');
  });
  ```
#### 1.2 路由方法
路由方法源于 HTTP 请求方法，和 express 实例相关联。Express 定义了如下和 HTTP 请求对应的路由方法： get, post, put, head, delete, options, trace, copy, lock, mkcol, move, purge, propfind, proppatch, unlock, report, mkactivity, checkout, merge, m-search, notify, subscribe, unsubscribe, patch, search, 和 connect。
常用的方法：get、post、put、delete
app.all() 是一个特殊的路由方法，没有任何 HTTP 方法与其对应，它的作用是对于一个路径上的所有请求加载中间件。
```
app.all('/a', (req, res, next)=> {
  dosomething();
  next();
});
相当于：
app.use('/a', (req, res, next)=> {
  dosomething();
  next();
});
```

#### 1.3 路由路径
路由路径和请求方法一起定义了请求的端点，它可以是字符串、字符串模式或者正则表达式。查询字符串不是路由路径的一部分。
- 使用字符串的路由路径示例：
  
  ```
  // 匹配 /about 路径的请求
  app.get('/about', (req, res)=> {
    res.send('about');
  });
  ```
- 使用字符串模式的路由路径示例：

  ```
  // 匹配 acd 和 abcd
  app.get('/ab?cd', function(req, res) {
    res.send('ab?cd');
  });
  // '/ab+cd'：匹配 abcd、abbcd、abbbcd等
  // '/ab*cd'：匹配 abcd、abxcd、abRABDOMcd、ab123cd等
  // '/ab(cd)?e'：// 匹配 /abe 和 /abcde
  ```
- 使用正则表达式的路由路径示例：

```
// 匹配任何路径中含有 a 的路径：
app.get(/a/, function(req, res) {
  res.send('/a/');
});

// 匹配 butterfly、dragonfly，不匹配 butterflyman、dragonfly man等
app.get(/.*fly$/, function(req, res) {
  res.send('/.*fly$/');
});
```

#### 1.4 路由句柄
可以为请求处理提供多个回调函数，其行为就是利用中间件处理请求。这些回调函数可以调用 next('route') 方法而略过其他路由回调函数。可以利用该机制为路由定义前提条件，如果在现有路径上继续执行没有意义，则可将控制权交给剩下的路径。（见上一章“重点注意”最后一条）
路由句柄有多种形式，可以是一个函数、一个函数数组，或者是两者混合：

```
const cb0 = (req, res, next)=> {
  console.log('CB0');
  next();
}

const cb1 = (req, res, next)=> {
  console.log('CB1');
  next();
}

app.get('/example/d', [cb0, cb1], (req, res, next)=> {
  console.log('response will be sent by the next function ...');
  next();
}, (req, res)=> {
  res.send('Hello from D!');
});
```
路由中间件用法举例：你可以创建可以用在任何路由中的通用函数。比如说，我们有种机制在特定页面上显示特殊优惠。特殊优惠经常换，并且不是每个页面上都显示。我们可以创建一个函数，将 specials 注入到 res.locals 属性中。

```
function specials(req, res, next){
  res.locals.specials = getSpecialsFromDatabase();
  next();
}
app.get('/page-with-specials', specials, function(req,res){
  res.render('page-with-specials');
});
```
我们也可以用这种方式实现授权机制。比如说我们的用户授权代码会设定一个会话变量req.session.authorized，则可以像下面这样做一个可重复使用的授权过滤器
```
function authorize(req, res, next){
  if(req.session.authorized) return next();
  res.render('not-authorized');
}
app.get('/secret', authorize, function(){
  res.render('secret');
})
app.get('/sub-rosa', authorize, function(){
  res.render('sub-rosa');
});

```
#### 1.5 app.route()
可使用 app.route() 创建路由路径的链式路由句柄。由于路径在一个地方指定，这样做有助于创建模块化的路由，而且减少了代码冗余和拼写错误
下面这个示例程序使用 app.route() 定义了链式路由句柄。
  ```
  app.route('/book')
    .get(function(req, res) {
      res.send('Get a random book');
    })
    .post(function(req, res) {
      res.send('Add a book');
    })
    .put(function(req, res) {
      res.send('Update the book');
    });
  ```
## 二、express.Router

可使用 express.Router 类创建模块化、可挂载的路由句柄。Router 实例是一个完整的中间件和路由系统，因此常称其为一个 “mini-app”。app.use()、app.get()、app.all()、app.route()等方法都可以对应到Router实例上。
下面的实例程序创建了一个路由模块，并加载了一个中间件，定义了一些路由，并且将它们挂载至应用的路径上。
在 app 目录下创建名为 birds.js 的文件，内容如下：
```
var express = require('express');
var router = express.Router();

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// 定义网站主页的路由
router.get('/', function(req, res) {
  res.send('Birds home page');
});
// 定义 about 页面的路由
router.get('/about', function(req, res) {
  res.send('About birds');
});

module.exports = router;
```
然后在应用中加载路由模块：
```
var birds = require('./birds');
app.use('/birds', birds);
```
## 三、组织路由
组织路由的方式有很多，但有几点应该是共通的
- 给路由处理器用命名函数
  在行内写路由处理的函数。这对于小程序说没问题，但随着网站的增长，这种方式很快就会变得过于笨重。
- 按逻辑将处理器分组
  我们应当用专门的模块中写路由处理的函数（比如在user.js中写user下的处理函数），然后导入到需要使用的地方。
- 将路由处理系统独立出来
  可以在一个文件中处理所有路由信息，然后在主程序中引用（适用于简单系统），也可以根据功能区域把路由文件分开，在主程序中引用。
- 路由组织应该是可扩展的
- 不要忽视自动化的基于视图的路由处理器
  如果你的网站由很多静态和固定 URL 的页面组成，你的所有路由最终看起来将像是：app.get('/static/thing', function(req, res){ res.render('static/thing'); }。要减少不必要的重复代码，可以考虑使用自动化的基于视图的路由处理器