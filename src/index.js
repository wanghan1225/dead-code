const analyzeTsConfig = require('fork-ts-unused-exports').default
const chalk = require('chalk')
const { omit, transform } = require('lodash')

const { createCli } = require('./cli')
const { whiteList, ignoreFiles } = require('./config')
const { parseTsConfig } = require('./util')
const binConfig = require('../bin/config')
const { getUnUsedFiles, delUnusedFiles } = require('./unusedFiles')



const start = (params) => {
  const { path:p, fix, del, delEmptyDirectory } = params
  const { config: { include } } = parseTsConfig(p)
  whiteList.add(include)
  const analyzeTsParams = {
    ignoreFiles,
    excludeDeclarationFiles: true,
    ...omit(params, Object.keys(binConfig))
  }
  const config = transform(analyzeTsParams, (result, value, key) => {
    result.push(`--${key}=${value}`)
  }, [])
  const result = analyzeTsConfig(p, config);

  const unExports = result.files
  const filenameArr = Object.keys(unExports).map((filename) => {
    return {
      filename: filename,
      varsIgnorePattern: `^${unExports[filename].map((item) => item.exportName).join('|')}$`,
    }
  })

  const unUsedFiles = getUnUsedFiles(result)
  console.log(chalk.red('==================================================unUsedFiles=================================================='))
  if (!unUsedFiles.length) {
    console.log(chalk.green('No unused files'))
  }
  unUsedFiles.forEach((filePath, index) => {
    console.log(chalk.green(`${index + 1}: ${filePath}`))
  })
  createCli({ filenameArr, fix, include })

  del && delUnusedFiles(unUsedFiles, delEmptyDirectory)
}


module.exports = {
  start
}