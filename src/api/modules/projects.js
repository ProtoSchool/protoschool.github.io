import { readFileSync } from 'fs'
import { resolve } from 'path'

import { staticPath } from '../config.js'

const STATIC_FILE = 'projects.json'

export function getStaticPath () {
  return resolve(staticPath, STATIC_FILE)
}

export const list = {}

list.get = function listGet () {
  return JSON.parse(readFileSync(getStaticPath(), 'utf8'))
}

export function get (id) {
  return list.get().find(project => project.id === id)
}
