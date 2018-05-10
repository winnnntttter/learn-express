## 一、概念和用法

#### 1.1 基本概念

- Express 是一个自身功能极简，完全是由路由和中间件构成一个的 web 开发框架：从本质上来说，一个 Express 应用就是在调用各种中间件。中间件是一种功能的封装方式，具体来说就是封装在程序中处理 HTTP 请求的功能。它可以访问请求对象（req）, 响应对象（res）, 和 web 应用中处于请求-响应循环流程中的中间件，一般被命名为 next 的变量。

#### 1.2 基本功能
- 执行任何代码。
- 修改请求和响应对象。
- 终结请求-响应循环。
- 调用堆栈中的下一个中间件。

#### 1.3 基本构成
- 中间件只是一个有 3 个参数的函数：一个请求对象、一个响应对象和一个 next 函数（还有一种 4 个参数的形式，用来做错误处理）

- 中间件是在管道中执行的，按顺序处理，应用中间件通过app.use(中间件)来向管道中插入中间件，路由级中间件和应用级中间件一样，只是它绑定的对象为 express.Router()。
  ```
  const app = express();
  app.use((req, res, next)=> {
    dosometing();
    next();
  });

  const router = express.Router();
  router.use((req, res, next)=> {
    dosometing();
    next();
  });
  ```

- 在管道的最后放一个“捕获一切”请求的处理器是常见的做法，由它来处理跟前面其他所有路由都不匹配的请求。这个中间件一般会返回状态码 404（未找到）。

#### 1.4 重点注意

- 路由处理器（app.get、app.post等）可以被看作只处理特定HTTP 谓词（GET、POST 等）的中间件。同样，也可以将中间件看作可以处理全部 HTTP谓词的路由处理器（基本上等同于 app.all，可以处理任何 HTTP 谓词

- 路由处理器的第一个参数必须是路径。如果你想让某个路由匹配所有路径，只需用 /*。中间件也可以将路径作为第一个参数，但它是可选的（如果忽略这个参数，它会匹配所有路径，就像指定了 /\* 一样）。
  ```
  //挂载至 /a 的中间件，任何指向 /a 的请求都会执行它，而指向别的地址的请求不会执行它
  app.use('/a',  (req, res, next)=> {
    dosometing();
    next();
  });

  // 一个挂载点装载一组中间件
  app.use('/a', (req, res, next)=> {
    dosometing();
    next();
  }, (req, res, next)=> {
    dosomethingother();
    next();
  });
  ```

- 路由处理器和中间件的参数中都有回调函数，这个函数有 2 个、3 个或 4 个参数，如果有 2 个或 3 个参数，头两个参数是请求和响应对象，第三个参数是 next 函数。如果有 4 个参数，它就变成了错误处理中间件，第一个参数变成了错误对象
  ```
  app.use('/b',  (err, req, res, next)=> {
    console.log('/b 检测到错误并传递 ');
    next(err);
  });
  ```

- 那么请求在管道中如何“终止”呢？这是由传给每个中间件的 next 函数来实现的。如果不调用 next()，请求就在那个中间件中终止了，此时应该发送一个响应到客户端（res.send、res.json、res.render 等）

- 如果调用了 next()，一般不宜再发送响应到客户端。如果发送了，管道中后续的中间件或路由处理器还会执行，但它们发送的任何响应都会被忽略

- 作为中间件系统的路由句柄，使得为路径定义多个路由成为可能。在下面的例子中，为指向 /user/:id 的 GET 请求定义了两个路由。第二个路由虽然不会带来任何问题，但却永远不会被调用，因为第一个路由已经终止了请求-响应循环。
  ```
  // 一个中间件栈，处理指向 /user/:id 的 GET 请求
  app.get('/user/:id', (req, res, next)=> {
    console.log('ID:', req.params.id);
    next();
  }, (req, res, next)=> {
    res.send('User Info');
  });

  // 处理 /user/:id， 打印出用户 id
  app.get('/user/:id', function (req, res, next) {
    res.end(req.params.id);
  });
  ```
  如果需要在中间件栈中跳过剩余中间件，调用 next('route') 方法将控制权交给下一个路由。 注意： next('route') 只对使用 app.VERB() 或 router.VERB() 加载的中间件有效。
  ```
  // 一个中间件栈，处理指向 /user/:id 的 GET 请求
  app.get('/user/:id', (req, res, next)=> {
    // 如果 user id 为 0, 跳到下一个路由
    if (req.params.id == 0) next('route');
    // 否则将控制权交给栈中下一个中间件
    else next(); //
  }, (req, res, next)=> {
    // 渲染常规页面
    res.render('regular');
  });

  // 处理 /user/:id， 渲染一个特殊页面
  app.get('/user/:id', (req, res, next)=> {
    res.render('special');
  });
  ```

#### 1.5 制作自己的中间件

- 新建module文件example.js
  ```
  const middleware1 = (req,res,next)=>{
    req.test = {a:"asd"};             //通过req对象传递数据。
    next();
  };
  const middleware2 = (req,res,next)=>{
    var test = req.test;
    test.b = "fff";
    next();
  };
  module.exports = {middleware1,middleware2};
  ```
- 在主程序中引用
  ```
  const mid = require('./lib/example');

  app.use(mid.middleware1);
  app.use(mid.middleware2);
  ```

## 二、常用中间件

#### 2.1 static
唯一内置的中间件，负责在 Express 应用中提托管静态资源。
使用：express.static(root, [options])。参数 root 指提供静态资源的根目录 options 为可选参数。
```
app.use(express.static('public'));
现在，public 目录下面的文件就可以访问了。
http://localhost:3000/images/kitten.jpg
http://localhost:3000/css/style.css

静态资源存放在多个目录下面，可以多次调用 express.static 中间件
如果希望所有通过 express.static 访问的文件都存放在一个“虚拟（virtual）”目录（即目录根本不存在）下面，可以通过为静态资源目录指定一个挂载路径的方式来实现
app.use('/static', express.static('public'));
现在，可以通过带有 “/static” 前缀的地址来访问 public 目录下面的文件了
http://localhost:3000/static/images/kitten.jpg
```

#### 2.2 body-parser
用于处理POST表单的请求体，主要用于处理application/json和application/x-www-form-urlencoded类型
```
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
```

#### 2.3 method-override
允许浏览器“假装”使用除 GET 和 POST之外的 HTTP 方法
```
const methodOverride = require('method-override');

app.use(methodOverride('_method'));

在提交的地址后加?_method=put或?_method=delete，method使用POST
```

#### 2.4 morgan
日志中间件
```
const logger = require('morgan');
app.use(logger('dev'));//请求信息打印在控制台，便于开发调试

//将日志记录在日志文件里
const accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
app.use(logger('combined', {stream: accessLogStream}));

将所有的请求记录在 log/ 目录下按每日日期生成的文件中，需要使用 file-stream-rotator 模块
const FileStreamRotator = require('file-stream-rotator');
//按日期分文件
const logDirectory = __dirname + '/log';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: logDirectory + '/%DATE%.log',
    frequency: 'daily',
    verbose: false
});
app.use(logger('combined', {stream: accessLogStream}));
```

#### 2.5 formidable
处理包含文件的表单的中间件
```
const formidable = require('formidable');

app.post('/add', (req, res,next) => {
  let form = new formidable.IncomingForm();
  form.parse(req,(err,fields,files)=>{
    //console.log(fields);//非文件对象集合
    //console.log(files);//文件对象集合
  });
});
```

#### 2.6 其他中间件

  - connect-flash：提供flash消息支持
  - cookie-parser：提供对 cookie 的支持
  - express-session：提供会话支持
  - csurf：防范跨域请求伪造（CSRF）攻击
  - errorhandler：为客户端提供栈追踪和错误消息
  - 更多中间件可以在npm上搜索“Express”、“Connect”和“Middleware”