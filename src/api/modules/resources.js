import debug from '../debug.js'
import { debug as _debug } from '../logger.js'
import { writeStaticFile } from '../utils.js'
import { STATIC_FILE, get as _get, getFormattedId, list } from './tutorials.js'

const logGroup = functionMethod => `[resources.${functionMethod}()]`

export function add (id, resource) {
  const tutorials = list.getJson()

  tutorials[getFormattedId(id)].resources.push(resource)

  writeStaticFile(STATIC_FILE, tutorials)
}

export function get (id) {
  const tutorial = _get(id)

  debug && _debug(logGroup('get'), id, tutorial)

  return tutorial.resources
}
