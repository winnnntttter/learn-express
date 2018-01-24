### 文件上传

- 指定enctype="multipart/form-data"，来启用文件上传

- 引入nodejs的核心模块：文件处理系统const fs = require('fs')

- 安装formidable模块来处理上传的文件

- 此时不能从req.body中取字段了，文件字段从files中取，非文件字段从fields中取
