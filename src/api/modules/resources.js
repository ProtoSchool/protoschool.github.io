const log = require('../logger')
const debug = require('../../utils/debug')
const tutorialsApi = require('./tutorials')
const utils = require('../utils')

const logGroup = functionMethod => `[resources.${functionMethod}()]`

async function add (id, resource) {
  const tutorials = await tutorialsApi.list.getJson()

  tutorials[tutorialsApi.getFormattedId(id)].resources.push(resource)

  await utils.writeStaticFile(tutorialsApi.STATIC_FILE, tutorials)
}

async function get (id) {
  const tutorial = await tutorialsApi.get(id)

  debug && log.debug(logGroup('get'), id, tutorial)

  return tutorial.resources
}

module.exports = {
  add,
  get
}
