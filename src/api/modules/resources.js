const log = require('../logger')
const debug = require('../debug')
const tutorialsApi = require('./tutorials')
const utils = require('../utils')

const logGroup = functionMethod => `[resources.${functionMethod}()]`

function add (id, resource) {
  const tutorials = tutorialsApi.list.getJson()

  tutorials[tutorialsApi.getFormattedId(id)].resources.push(resource)

  utils.writeStaticFile(tutorialsApi.STATIC_FILE, tutorials)
}

function get (id) {
  const tutorial = tutorialsApi.get(id)

  debug && log.debug(logGroup('get'), id, tutorial)

  return tutorial.resources
}

module.exports = {
  add,
  get
}
