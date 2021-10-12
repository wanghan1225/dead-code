const ts = require('typescript')
const fs = require('fs')



function parseTsConfig(tsconfigPath) {
  try {
    const parseJsonResult = ts.parseConfigFileTextToJson(tsconfigPath, fs.readFileSync(tsconfigPath, { encoding: 'utf-8' }))
    if (parseJsonResult.error)
            throw parseJsonResult.error;
    return parseJsonResult
  } catch (e) {
    throw "\n    Cannot parse '" + tsconfigPath + "'.\n\n    " + JSON.stringify(e) + "\n  ";
  }
  
}



module.exports = {
  parseTsConfig,
}