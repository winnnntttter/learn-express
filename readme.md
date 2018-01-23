<!-- - git init生成本地库
- 将node_modules添加到.gitignore
- git config --global user.name "Your_Username" git config --global user.email username@xxx.com切换用户
- git add -A
- git commit -m ""
- git remote add origin https://github.com/winnnntttter/learn-express.git
- git push -u origin master 
- npm i -g node-dev全局安装node-dev，使用node-dev xxx.js来启动-->

## 一、express简介
#### 1.1 概念
基于 Node.js 平台，快速、开放、极简的 web 开发框架
#### 1.2 特点
- node:异步、事件驱动、单线程、语言统一、适用I/O密集型高并发
- express：更简洁的API、中间件、和路由让程序的组织管理变的更加容易、可拓展性强
#### 1.3 安装
- 安装node
- 合适的命令行工具
- 安装express（或者直接使用生成器express-generator）
- nodejs和express的Hello World实例
#### 1.4 其他工具
- git 版本控制
- mocha 测试
- jsHint或ESLint代码检查
- nodemon或node-dev开发中重启服务
- 模块化工具Webpack
## 二、express核心
- 请求和响应对象（request，response）
- 模板引擎
- 表单处理
- cookie和session
- 中间件