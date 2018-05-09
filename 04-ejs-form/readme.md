## 一、表单提交

#### 1.1 表单提交的方法：

- 大体上讲，向服务器发送客户端数据有两种方式：查询字符串和请求正文。通常，如果是使用查询字符串，就发起了一个 GET 请求；如果是使用请求正文，就发起了一个 POST 请求

- 建议使用post提交表单，如果使用GET请求，用户会在查询字符串中看到所有的输入数据（包括隐藏域）。

- 使用PUT和DELETE的步骤：

  ```
  //1. 引用methodOverride中间件
    const methodOverride = require('method-override');
    app.use(methodOverride('_method'));
  //2. 定义app.put和app.delete这类路由

  //3. 在提交的地址后加?_method=put或?_method=delete，method使用POST
    <form method="post" action="/user?_method=put">
  //4. 使用jquery的ajax提交可以有两种方式：
  $.ajax({
      url: '/user?_method=delete',
      type: 'POST',
      data: {id:"123"},

  //或者
  $.ajax({
      url: '/user',
      type: 'DELETE',
      data: {id:"123"},

  //express判断为ajax请求的方法：
  if (req.xhr || req.accepts('json,html')==='json') {//ajax提交的处理方法
    res.json({'result':true,'message':'success!'});
  }else{                                             //非ajax
    res.redirect(303,'/list');//重定向到list页
  }
  //如果是AJAX请求，req.xhr值为 true。req.accepts 试图确定返回的最合适的响应类型。req.accepts('json,html') 询问最佳返回格式是JSON 还是 HTML，根据这两个属性返回合适的数据
  ```
  

#### 1.2 表单请求对象：

- get提交的表单，表单域在req.query对象中。

- post提交的表单，通过body-parser中间件处理后，请求体在req.body对象中调用。

- 路径中的参数，在req.params中获取（请求对象的处理请参考第二节内容“请求对象”）。

#### 1.3 RESTful风格设计

REST是英文representational state transfer(表象性状态转变)或者表述性状态转移;Rest是web服务的一种架构风格。

在RESTful之前的操作：
- http://127.0.0.1/user/query/1 GET  根据用户id查询用户数据
- http://127.0.0.1/user/save POST 新增用户
- http://127.0.0.1/user/update POST 修改用户信息
- http://127.0.0.1/user/delete GET/POST 删除用户信息
RESTful用法：
- http://127.0.0.1/user/1 GET  根据用户id查询用户数据
- http://127.0.0.1/user  POST 新增用户
- http://127.0.0.1/user  PUT 修改用户信息
- http://127.0.0.1/user  DELETE 删除用户信息

之前的操作是没有问题的,有人认为是有问题的,有什么问题呢?每次请求的接口或者地址,都在做描述,例如查询的时候用了query,新增的时候用了save,其实完全没有这个必要,我使用了get请求,就是查询.使用post请求,就是新增的请求,我的意图很明显,完全没有必要做描述,这就是为什么有了restful。


#### 处理完表单：

- 直接响应HTML：处理表单之后，可以直接向浏览器返回 HTML(如果用户尝试重新加载页面，这种方法就会产生警告，并且会影响书签和后退按钮。基于这些原因，不推荐这种方法)

- 使用303重定向，各种重定向的代码含义：http://blog.csdn.net/liaomin416100569/article/details/45969749

  1. 重定向到专有的成功/失败页面：便于分析，用户体验差
  2. 运用flash消息重定向到原来位置：有许多小表单分散在整个站点中（例如，电子邮件登录），最好的用户体验是不干扰用户的导航流。也就是说，需要一个不用离开当前页面就能提交表单的方法。当然，要做到这一点，可以用 AJAX，但是如果你不想用 AJAX（或者你希望备用机制能够提供一个好的用户体验），可以重定向回用户之前浏览的页面。最简单的方法是在表单中使用一个隐藏域来存放当前 URL。因为你想有一种反馈，表明用户的提交信息已收到，所以你可以使用 flash 消息。
  3. 运用flash消息重定向到新位置：将用户导向下一个期望页面，如果要提示用户提交结果，可以用flash消息显示。
    ```
    //使用flash消息
    app.use(flash());

    app.use((req, res, next)=>{
      res.locals.flash_success_message = req.flash('flash_success_message'); 
      res.locals.flash_error_message = req.flash('flash_error_message');        
      next();
    });

    //根据请求结果赋值
    if(flag === true){
      req.flash('flash_success_message', '删除成功！');
    }else{
      req.flash('flash_error_message', '删除失败！');
    }

    //将消息在跳转后的页面显示
    <% if(flash_success_message != ''){ %>
    <div class="alert alert-success alert-dismissible" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <strong>恭喜!</strong><%= flash_success_message %>
    </div>
    <% } %>
    ```


- 处理ajax表单：如果是AJAX请求，直接返回处理结果（标识及详细信息），让前台根据返回的标识展示信息或者跳转到别的页面。
  
  ```
  $.ajax({
    url: '/user?_method=delete',
    type: 'POST',
    data: {id:$this.attr("data-id")},
    success: function(data){
      if(data.result){
        //window.location.href="/list";
        alert("删除成功！通过ajax")
        $this.parents("tr").remove();
      } else {
        alert("Error");
      }
    },
    error: function(){
      alert("Other Error");
    }
  });
  ```

- 指定enctype="multipart/form-data"，来启用文件上传