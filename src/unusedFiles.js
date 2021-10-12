const chalk = require('chalk');
const { unlink, readdir, rmdir, stat } = require('fs').promises
const path = require('path')

const { workDir, whiteList, ignoreFiles } = require('./config')

// 收集删除文件和目录
const delFiles = new Set(), delDirs = new Set()

function getUnUsedFiles({ allFiles, importFiles }) {
  const usedFileObj = importFiles.reduce((prev, current) => {
    const imports = current.imports;
    Object.keys(imports).forEach((path) => {
      const currentFile = importFiles.find((file) => file.path === path);
      currentFile && (prev[currentFile.fullPath] = true);
    });
    return prev;
  }, {});
  return allFiles
    .map((absPath) => absPath.replace(/\//g, '\\'))
    .filter(
      (filePath) =>
        !whiteList.value.includes(filePath) &&
        !usedFileObj[filePath] &&
        !new RegExp(ignoreFiles, 'u').test(filePath)
    )
    .map((filePath) => path.relative(workDir, filePath));
}

function delUnusedFiles(targets = [], isDelEmptyDirectory) {
  Promise.all(targets.map((filePath) => {
    return unlink(filePath)
    .then(() => {
      delFiles.add(filePath)
      return !isDelEmptyDirectory ? Promise.resolve() : delDir(path.join(filePath, '../'))
    })
  }))
  .catch((err) => {
    console.log(chalk.red(err))
  })
  .finally(() => {
    if (delFiles.size) {
      console.log(chalk.red('==================================The following files were successfully deleted=================================='));
      [...delFiles].forEach((delFiles) => {
        console.log(chalk.green(delFiles))
      })
    }

    if (delDirs.size) {
      console.log(chalk.red('=================================The following directories were successfully deleted=================================='));
      [...delDirs].forEach((delDir) => {
        console.log(chalk.green(delDir))
      })
    }
    
  })
}

function delDir(dirPath) {
  if (dirPath === workDir) {
    return Promise.resolve()
  }
  return readdir(dirPath)
  .then((files) => {
    if (files.length === 0) {
      return stat(dirPath).then(() => rmdir(dirPath).then(() => {
        delDirs.add(path.relative(workDir, dirPath))
      }))
    }
  })
  .then(() => {
    return delDir(path.resolve(dirPath, '../'))
  })
}



module.exports = {
  getUnUsedFiles,
  delUnusedFiles,
}