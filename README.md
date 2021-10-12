## 废弃代码删除工具dead-code
技术栈：ts-unused-exports + eslint-plugin + fixer + commander

相关依赖说明：
- fork-ts-unused-exports：用于检测未使用的exports
- eslint-plugin-deadvars：配合fork-ts-unused-exports检测出未使用的变量
- eslint-plugin-autofix-fork：通过eslint的fixer，修复问题

使用：
- 命令`dead-code`或`dc`会根据当前目录的tsconfig.json文件中的`include`字段，检测出后缀为`.js, .jsx, .ts, .tsx`文件中未使用的exports，包括变量、函数、函数形参、import、type、interface、enum

| 命令 | 描述 | 默认值 |
| :------:| :------: | :------: |
| dc --f 或 dc --fix | 是否自动修复检测问题 | false |
| dc -p [path] 或 dc --path [path] | tsconfig的路径 | 当前工作目录 + tsconfig.json |
| dc --d 或 dc --del | 是否删除所有未使用的文件 | false |
| dc --ded 或 dc --delEmptyDirectory | 是否删除因删除未使用的文件产生的空文件夹 | false |

也可以使用`dc --help`命令查看可传入的参数

除此之外，还可传入`ts-unused-exports`支持的参数，具体可查看[文档](https://www.npmjs.com/package/ts-unused-exports)

传入`ts-unused-exports`的默认参数：
- excludeDeclarationFiles: true
- ignoreFiles: `(\\.(test|spec)\\.[tj]s$)|(\\.md$)|(\\.d\\.ts$)\`

