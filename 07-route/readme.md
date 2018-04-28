### 路由设计规则
  - 不使用route模块：
   - 所有路由信息放到入口文件中，在routes文件夹下创建各个模块的js文件，在各个模块的独立文件中指向各自的模板页面，将各个路由的执行函数放入exports导出，在index中引入


### method-override中间件

- 作用是使用REST风格的http请求时,进行改写后,可以使app.put或app.delete这类路由设置能够生效.

- 使用：
  - 在index中使用app.use(methodOverride('_method')); 在action后加?_method=put