const fs = require('fs').promises
const path = require('path')

const config = require('./config')

const correctedCases = {
  api: 'API',
  cid: 'CID',
  of: 'of',
  a: 'a'
}

async function writeStaticFile (staticFileName, data) {
  await fs.writeFile(path.resolve(config.staticPath, staticFileName), JSON.stringify(data, null, 2))
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
