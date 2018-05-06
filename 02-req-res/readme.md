## 一、网络请求和响应报头

#### 1.1 url的组成   
包含协议、主机名、端口、路径、查询字符串、信息片段

#### 1.2 请求报头
我们浏览网页时，发送到服务器的并不只是 URL。当你访问一个网站时，浏览器会发送很多“隐形”信息。服务器会因此得知优先响应哪种语言的页面。它也会发送“用户代理”信息（浏览器、操作系统和硬件设备）和其他一些信息。
使用浏览器的开发者工具可以查看具体信息
在express中可以通过req.headers获取

#### 1.3 响应报头
当服务器响应时，同样会回传一些浏览器没必要渲染和显示的信息，通常是元数据和服务器信息，包括浏览器正在被传输的内容类型、响应信息是否被压缩、以及使用的是哪种编码，响应报头还可以包含关于浏览器对资源缓存时长的提示。响应报头还经常会包含一些关于服务器的信息使用app.disable('x-powered-by')来禁用显示。
使用浏览器的开发者工具可以查看具体信息
在express中可以通过res._headers获取部分信息

## 二、请求对象

#### 2.1 请求体
请求报头外，请求还有一个主体（就像作为实际内容返回的响应主体一样）。一般 GET请求没有主体内容，但 POST 请求是有的。POST 请求体的常见媒体类型：
    
- 默认post表单提交：application/x-www-form-urlendcoded，是键值对集合的简单编码，用 & 分隔（基本上和查询字符串的格式一样）。
- 支持文件上传的请求：multipart/form-data，它是一种更为复杂的格式。
- 发送json请求：application/json。（发送json字符串）
- jquery默认的 content-Type 配置的是 application/x-www-form-urlencoded，因此更改ajax请求参数：contentType: "application/json"可发送json数据

```
$.ajax({
    url: "/save",
    type: "post",
    contentType: "application/json",
    data: JSON.stringify({
        name: "henry",
        age: 30,
        hobby: [ "sport", "coding" ]
    })
});
```

#### 2.2 请求对象常用属性

- req.params：命名过的路由参数。如果路由中定义/user/:name，那么“name”属性可作为req.params.name。该对象默认为{}。多适用于REST风格url中的路由参数的解析

    ```
    router.get("/staff/:city",(req,res)=>{
        let params = req.params; 
    });
    router.get("/staff/:city/:name",(req,res)=>{
        let params = req.params; 
    });
    //请求 /staff/beijing/li 此时req.params为{ city: 'beijing', name: 'li' }
    //如果未定义/staff，则访问/staff会出现404错误
    ```
    使用方法：如上述例子可以根据路由1中的city查询数据库中该city下的所有员工，该路由下展示员工列表，根据路由2的name(正常一般用id)查询该员工的详情，该路由下展示员工详情。

- req.query：查询字符串参数。路径后的?name=li&like=eating类似的参数，不需要在路由中定义，该对象默认为{}。用于查询，与req.params的区别：req.params包含路由参数（在URL的路径部分），而req.query包含URL的查询参数（在URL的？后的参数）

    ```
    router.get("/staff/:city",(req,res)=>{
        let querys = req.query;
    })

    //请求/staff/beijing?name=li&like=eating 此时req.query为{ name: 'li', like: 'eating' }
    ```
    用法：如/staff/city为员工列表页，/staff/beijing?name=li&like=eating只展示name为李并且like为eating的员工。

- req.body:POST请求体，需要使用body-parser中间件处理req.body：npm i body-parser --save。POST的请求参数不像查询字符串在url中传递，而是在REQUEST正文中传递。

    ```
    router.post("/staff",function(req,res){
        let reqBody = req.body; // {"beijing":{"zhao":{"like":"listening"}}}
    })

    //请求 curl -H 'Content-Type: application/json' -X POST -d '{"beijing":{"zhao":{"like":"listening"}}}' "http://localhost:3000/staff" -i 

    ```

    POST请求体的不同类型见上文，需要注意的是body-parser中间件处理不同类型的POST请求时的不同用法：

    1. 处理application/json类型：app.use(bodyParser.json())。
    2. 处理默认post表单即application/x-www-form-urlencoded类型：app.use(bodyParser.urlencoded({ extended: false}))。extended 为false时不能正确的解析复杂对象（多级嵌套）如staff[0][name]=li&staff[0][like]=eating。这是因为：extended选项允许配置使用querystring(false)或qs(true)来解析数据，默认值是true（不推荐），querystring并不能正确的解析复杂对象（多级嵌套），而qs却可以做到，qs只会解析5层嵌套。querystring.parse("name=henry&age=30") => { name: 'henry', age: '30' }

- 其他req的属性：

    - req.route获得路由信息

    - req.cookies：客户端的cookies值

    - req.ip：客户端ip地址

    - req.path：请求路径

    - req.host：客户端主机名等


## 三、响应对象

响应对象（通常传递到回调方法，这意味着你可以随意命名它，通常命名为 res、response），以下为响应对象常见的属性和方法，后面用到的会在之后详细讲解。

- res.status(code)：设置 HTTP 状态代码。Express 默认为 200（成功），所以你可以使用这个方法返回状态404（页面不存在）或 500（服务器内部错误），或任何一个其他的状态码。对于重定向（状态码 301、302、303 和 307），有一个更好的方法：redirect。

    ```
    app.use((req,res,next)=>{
        res.status(404); //如果不设置，状态码仍是200或304（缓存）。
        res.send('404 - Not Found，未设置此页面的路由。');
    });
    app.use((err,req,res,next)=>{
        console.error(err);
        res.status(500); //如果不设置，状态码仍是200或304（缓存）。
        res.send('500 - Server Error，这是程序内部错误，请检查代码。');
    });
    ```
- res.set(name,value)：设置响应头。这通常不需要手动设置。

- res.send(body),res.send(status,body)：向客户端发送响应及可选的状态码。Express 的默认内容类型是 text/html。如果你想改为 text/plain，需要在 res.send 之前调用 res.set('Content-Type','text/plain')。如果 body 是一个对象或一个数组，响应将会以 JSON 发送（内容类型需要被正确设置），不过既然想发送 JSON，推荐调用 res.json。

- res.json(json),res.json(status,json)：向客户端发送 JSON 以及可选的状态码（通常用于ajax请求返回消息）。

- res.jsonp(json),req.jsonp(status,json)：向客户端发送 JSONP 及可选的状态码。（用于跨域请求）

- res.render(view,[locals],callback)： 使用配置的模板引擎渲染视图（后面详细讲）。

- res.redirect([status],url)重定向浏览器。默认重定向代码是 302（临时重定向）。通常，应尽量减少重定向，除非永久移动一个页面，这种情况应当使用代码 301（永久移动）。常用方法：表单提交后的重定向使用代码303：

    ```
    app.post('/staff2', (req, res, next) => {
        for(let i in req.body.staff){
            staff2.push(req.body.staff[i]);
        }
        //res.json(staff2);
        res.redirect(303,'/staff2list');
    });
    ```

- res.type(type)：一个简便的方法，用于设置 Content-Type 头信息。基本上相当于 res.set('ContentType','type')，只是如果你提供了一个没有斜杠的字符串，它会试图把其当作文件的扩展名映射为一个互联网媒体类型。比如，res.type('txt') 会将 Content-Type 设为text/plain。此功能在有些领域可能会有用（例如自动提供不同的多媒体文件），但是通常应该避免使用它，以便明确设置正确的互联网媒体类型。

    ```
    app.use((req,res,next)=>{
        res.type('text/plain');
        res.send('404','<h3>404 - Not Found，未设置此页面的路由。</h3>');
        //此时不再识别html标签。
    });
    ```
