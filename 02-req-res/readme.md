- 响应报头包含服务器类型信息，试用app.disable('x-powered-by')来禁用

- 一般get没有请求体，post的请求体最常见的媒体类型是application/x-www-form-urlencoded(&分隔和查询字符串一样的格式)

- 支持文件上传的话，媒体类型为multipart/form-data,ajax请求为application/json。

- req.params：命名过的路由参数,例如：路由/staff/:city/:name，请求地址为http://localhost:3000/staff/beijing/li时req.params为{ city: 'beijing', name: 'li' }

- req.query：查询字符串参数，例如：请求地址为http://localhost:3000/staff/beijing/li?aa=1&bb=2时req.query为{ aa: '1', bb: '2' }

- body-parser中间件处理req.body：npm i body-parser --save，然后req.body就和req.query等类似了