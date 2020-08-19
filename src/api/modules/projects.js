const fs = require('fs')
const path = require('path')

const config = require('../config')

const STATIC_FILE = 'projects.json'

function getStaticPath () {
  return path.resolve(config.staticPath, STATIC_FILE)
}

const list = {}

list.get = function listGet () {
  return JSON.parse(fs.readFileSync(getStaticPath(), 'utf8'))
}

function get (id) {
  return list.get().find(project => project.id === id)
}

module.exports = {
  getStaticPath,
  get,
  list
}
