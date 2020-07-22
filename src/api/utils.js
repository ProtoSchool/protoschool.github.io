const fs = require('fs')
const path = require('path')

const config = require('./config')

const correctedCases = {
  api: 'API',
  cid: 'CID',
  of: 'of',
  a: 'a'
}

function writeStaticFile (staticFileName, data) {
  fs.writeFileSync(path.resolve(config.staticPath, staticFileName), JSON.stringify(data, null, 2))
}

function deriveShortname (path) {
  return path.split('-').map(word => (
    correctedCases[word] ? correctedCases[word] : (word.charAt(0).toUpperCase() + word.slice(1))
  )).join(' ')
}

module.exports = {
  writeStaticFile,
  deriveShortname
}
