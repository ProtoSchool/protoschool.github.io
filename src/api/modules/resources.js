import { debug as _debug } from '../logger'
import debug from '../debug'
import { list, getFormattedId, STATIC_FILE, get as _get } from './tutorials'
import utils from '../utils'

const logGroup = functionMethod => `[resources.${functionMethod}()]`

function add (id, resource) {
  const tutorials = list.getJson()

  tutorials[getFormattedId(id)].resources.push(resource)

  utils.writeStaticFile(STATIC_FILE, tutorials)
}

function get (id) {
  const tutorial = _get(id)

  debug && _debug(logGroup('get'), id, tutorial)

  return tutorial.resources
}

export default {
  add,
  get
}
