const path = require('path')


function createWhiteList(workDir) {
  let whiteList = []
  return {
    add(entries = []) {
      whiteList = whiteList.concat(entries.reduce((prev, cur) => {
        prev.push(path.resolve(workDir, cur, 'index.ts'), path.resolve(workDir, cur, 'index.js'))
        return prev
      }, []))
    },
    get value() {
      return whiteList
    }
  }
}

module.exports = {
  createWhiteList
}