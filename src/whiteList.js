const path = require('path')
const fs = require('fs')

const entry = ['index.ts', 'index.tsx', 'index.js', 'index.jsx']
function createWhiteList(workDir) {
  let whiteList = []
  return {
    add(entries = []) {
      whiteList = whiteList.concat(entries.reduce((prev, cur) => {
        const statObj = fs.statSync(path.resolve(workDir, cur))
        if (statObj.isDirectory()) {
          return prev.concat(entry.map((entryItem) => path.resolve(workDir, cur, entryItem)))
        }
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