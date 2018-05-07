## 一、模板引擎简介

#### 1.1 概念
模板引擎是为了使用户界面与业务数据（内容）分离而产生的，它可以生成特定格式的文档，用于网站的模板引擎就会生成一个标准的HTML文档。通俗点说，就是在需要根据不同数据，重复生成结构相同的html时候，模板可以大大节省你的代码量，以及提高可维护性。

#### 1.2 原理
模板引擎就是利用正则表达式识别模板标识，并利用数据替换其中的标识符。

```
const tpl = "Hello {{visitorname}}, Welcome to {{worldname}}!";
const data = {
    visitorname: "aaa",
    worldname: "usa"
};
const pattern = /{{([\s\S]+?)}}/gi;
const result = tpl.replace(pattern, (match, tuple)=>{
    return data[tuple];
});

app.get('/index',(req,res)=>{
    res.send(result);
});
```
#### 1.3 优势

- 实现数据和展示的完美分层
- 不用拼接字符串
- 可维护性（后期改起来方便）
- 可扩展性（想要增加功能，增加需求方便）
- 开发效率提高（程序逻辑组织更好，调试方便）
- 可读性好（不容易写错）

## 二、ejs模板

#### 2.1 特点
- 快速编译和渲染
- 简单的模板标签
- 自定义标记分隔符
- 支持文本包含
- 支持浏览器端和服务器端
- 模板静态缓存
- 支持express视图系统

#### 2.2 引入和使用

```
//引入模块
const ejs = require('ejs');

//设置引擎为ejs
app.set('view engine','ejs');

//设置模板目录
app.set('views', path.join(__dirname, 'views')); 

//将数据和模板文件结合传给指定路由
app.get('/',function (req, res) {
    res.render('index',data);
});
```

#### 2.3 选项
- 使用方法：
    ```
    1. 使用app.set('view options', options);如app.set('view options', {delimiter: '?'});
    2. let ejsOptions = {delimiter: '?'};
       app.engine('ejs', (path, data, cb) => {
           ejs.renderFile(path, data, ejsOptions, cb);
       });
    3. app.locals.delimiter = '?'
    4. 直接写在渲染数据中如：
       app.get('/', (req, res) => {
           res.render('index', {foo: 'FOO', delimiter: '?'});
       });
    ```
- 选项说明：

    - cache 编译过的函数会被缓存，需要filename

    - filename 被cache用做缓存的键，用于包含

    - context 函数执行的上下文

    - compileDebug 如果为false，不会编译调试用的工具

    - client 返回独立的编译后的函数

    - delimiter 开启或者闭合尖括号所用的字符

    - debug 输出生成的函数体

    - _with 是否使用 with() {} 结构。如果为 false 则局部数据会储存在 locals 对象中。

    - rmWhitespace 移除所有可以安全移除的空白字符，包含前导和尾后的空白字符。同时会为所有scriptlet标签开启-%>换行截断的更加安全的模式。（它不会在一行之中去除标签的换行）。

#### 2.4 标签
- <% 'Scriptlet' 标签, 用于控制流，没有输出

- <%= 向模板输出值（带有转义）

- <%- 向模板输出没有转义的值

- <%# 注释标签，不执行，也没有输出

- <%% 输出字面的 '<%'

- %> 普通的结束标签

- -%> Trim-mode ('newline slurp') 标签, 移除随后的换行符

- <%_ 移除前面的空格

- _%> 移除后面的空格

#### 2.5 常用方法

- 利用<%- include filename %>加载其他页面模版
    ```
    <%- include("./header.ejs") %>

    //向其他模块传数据
    <%- include("./header.ejs",{title:'标题'}) %>
    ```
- 引入数据
    ```
    app.get('/',(req, res)=>{
        res.render('index',data); //对象可直接引用其属性
    });

    app.get('/list',(req, res)=>{
        res.render('list',{staff}); //数组加{}
    });
    ```
- 循环
    ```
    <%for (var i=0;i<staff.length;i++){%>
        <li><span>姓名</span><%=staff[i].name%>，<span>年龄：</span><%=staff[i].age%>，<span>爱好：<%=staff[i].like%></span></li>
    <%}%>
    //like为数组时，自动转成用英文逗号连接的字符串，处理成中文逗号staff[i].like.toString().replace(',','，')
    ```
- 判断
    ```
    <%for (var i=0;i<staff.length,staff[i].age>19;i++){%>
        <li><span>姓名</span><%=staff[i].name%>，<span>年龄：</span><%=staff[i].age%>，<span>爱好：<%=staff[i].like.toString().replace(',','，')%></span></li>
    <%}%>

    <%for (var i=0;i<staff.length;i++){%>
        <tr><td><%=staff[i].name%></td><td><%=staff[i].age>19?'青年':'少年'%></td><td><%=staff[i].like.toString().replace(',','，')%></td></tr>
    <%}%>
    ```
#### 2.6 过滤器(编译出错，已废弃？)

把结果进一步加工的函数，语法：<%=: data.age | plus:5%>

