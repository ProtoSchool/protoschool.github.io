import { readFileSync } from 'fs'
import { resolve } from 'path'

import { staticPath } from '../config'

const STATIC_FILE = 'projects.json'

function getStaticPath () {
  return resolve(staticPath, STATIC_FILE)
}

const list = {}

list.get = function listGet () {
  return JSON.parse(readFileSync(getStaticPath(), 'utf8'))
}

function get (id) {
  return list.get().find(project => project.id === id)
}

export default {
  getStaticPath,
  get,
  list
}
