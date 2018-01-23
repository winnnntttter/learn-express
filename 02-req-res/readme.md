- 响应报头包含服务器类型信息，使用app.disable('x-powered-by')来禁用

- 一般get没有请求体，post的请求体最常见的媒体类型是application/x-www-form-urlencoded(&分隔和查询字符串一样的格式)

- 支持文件上传的话，媒体类型为multipart/form-data,ajax请求为application/json。
### req对象
- req.params：命名过的路由参数

```
//请求 /staff/beijing/li

router.get(“/staff/:city/:name”,function(req,res){
    var params = req.params; // { city: 'beijing', name: 'li' }
})
```

- req.query：查询字符串参数

```
//请求 /staff/beijing/li?aa=1&bb=2

router.get(“/staff/:city/:name”,function(req,res){
    var querys = req.query; // { aa: '1', bb: '2' }
})
```

- req.body:post请求的请求体，使用body-parser中间件处理req.body：npm i body-parser --save，
```
//请求 curl -H 'Content-Type: application/json' -X POST -d '{"beijing":{"zhao":{"like":"listening"}}}' "http://localhost:3000/staff" -i 

router.post(“/staff”,function(req,res){
    var reqBody = req.body; // {"beijing":{"zhao":{"like":"listening"}}}
})
```
- req.route获得路由信息

- req.cookies：客户端的cookies值

- req.signedCookies：获得签名cookies信息，当我们在cookieParser(secret)  插件应用 secret时，cookie是经过签名的。

- req.headers：从客户端接收的请求报头

- req.accepts([types])：用来确定客户端是否接受一个或一组指定的类型

- req.ip：客户端ip地址

- req.path：请求路径

- req.host：客户端主机名

- req.xhr：判断是否为ajax发起的请求

- req.protocol：请求协议

- req.url/req.originalurl：路径和查询字符串（不包括协议、主机、端口），req.url出于内部路由目的可以重写，req.originalurl旨在保留原始请求。

### res对象

- res.status(code)：设置 HTTP 状态代码。Express 默认为 200（成功），所以你可以使用这个方法返回状态404（页面不存在）或 500（服务器内部错误），或任何一个其他的状态码。对于重定向（状态码 301、302、303 和 307），有一个更好的方法：redirect。

- res.set(name,value)：设置响应头。这通常不需要手动设置。

- res.cookie（name,vaue,[options]）,res.clearCookie(name,[options])：设置或清除客户端 cookies 值

- res.redirect([status],url)：重定向浏览器。默认重定向代码是 302（建立）。通常，你应尽量减少重定向，除非永久移动一个页面，这种情况应当使用代码 301（永久移动）

- res.send(body),res.send(status,body)：向客户端发送响应及可选的状态码。Express 的默认内容类型是 text/html。如果你想改为 text/plain，需要在 res.send 之前调用 res.set('Content-Type','text/plain')。如果 body 是一个对象或一个数组，响应将会以 JSON 发送（内容类型需要被正确设置），不过既然你想发送 JSON，我推荐你调用 res.json。

- res.json(json),res.json(status,json)：向客户端发送 JSON 以及可选的状态码

- res.jsonp(json),req.jsonp(status,json)：向客户端发送 JSONP 及可选的状态码。

- res.type(type)：一个简便的方法，用于设置 Content-Type 头信息。基本上相当于 res.set('ContentType','type')，只是如果你提供了一个没有斜杠的字符串，它会试图把其当作文件的扩展名映射为一个互联网媒体类型。比如，res.type('txt') 会将 Content-Type 设为text/plain。此功能在有些领域可能会有用（例如自动提供不同的多媒体文件），但是通常应该避免使用它，以便明确设置正确的互联网媒体类型。

- res.format(object)：这个方法允许你根据接收请求报头发送不同的内容。这是它在 API 中的主要用途，我们将会在第 15 章详细讨论。这里有一个非常简单的例子：res.format({'text/plain':'hi there','text/html':'<b>hi there</b>'})。

- res.attachment([filename]),res.download(path,[filename],[callback])：这两种方法会将响应报头 Content-Disposition 设为 attachment，这样浏览器就会选择下载而不是展现内容。你可以指定 filename 给浏览器作为对用户的提示。用 res.download 可以指定要下载的文件，而 res.attachment 只是设置报头。另外，你还要将内容发送到客户端。

- res.sendFile(path,[option],[callback])：这个方法可根据路径读取指定文件并将内容发送到客户端。使用该方法很方便。使用静态中间件，并将发送到客户端的文件放在公共目录下，这很容易。然而，如果你想根据条件在相同的 URL 下提供不同的资源，这个方法可以派上用场。

- res.links(links)：设置链接响应报头。这是一个专用的报头，在大多数应用程序中几乎没有用处。

- res.locals,res.render(view,[locals],callback)：res.locals 是一个对象，包含用于渲染视图的默认上下文。res.render 使用配置的模板引擎渲染视图（不能把 res.render 的 locals 参数与 res.locals 混为一谈，上下文在 res.locals 中会被重写，但在没有被重写的情况下仍然可用）。res.render 的默认响应代码为 200，使用 res.status 可以指定一个不同的代码。
