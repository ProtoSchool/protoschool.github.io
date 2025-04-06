import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { staticPath } from './config.js'

const correctedCases = {
  api: 'API',
  cid: 'CID',
  of: 'of',
  a: 'a'
}

export function writeStaticFile(staticFileName, data) {
  writeFileSync(resolve(staticPath, staticFileName), JSON.stringify(data, null, 2))
}

export function deriveShortname(path) {
  return path.split('-').map(word => (
    correctedCases[word] ? correctedCases[word] : (word.charAt(0).toUpperCase() + word.slice(1))
  )).join(' ')
}
