const { createWhiteList } = require('./whiteList')

// 工作目录
const workDir = process.cwd()


// 白名单
const whiteList = createWhiteList(workDir)

const ignoreFiles = '(\\.(test|spec)\\.[tj]s$)|(\\.md$)|(\\.d\\.ts$)'


module.exports = {
  workDir,
  whiteList,
  ignoreFiles,
}