/**
 * Tutorials module which includes all CRUD operations for tutorials.
 *
 * @module api/tutorials
 */

const fs = require('fs')
const path = require('path')

const errorCode = require('err-code')
const _ = require('lodash')
const del = require('del')

const log = require('../logger')
const debug = require('../debug')
const config = require('../config')
const utils = require('../utils')
const lessonsApi = require('./lessons')
const projectsApi = require('./projects')

const STATIC_FILE = 'tutorials.json'

const logGroup = log.createLogGroup('tutorials')

function getNextTutorialId () {
  return list.getLatest().id + 1
}

function getFormattedId (id) {
  return id.toString().padStart(4, 0)
}

function getId (formattedId) {
  return parseInt(formattedId, 10)
}

/**
 * Fetches Tutorial data
 *
 * @param {String|Object} id Tutorial id or simple tutorial object from static JSON file with at least a `url` property
 *
 * @returns Final tutorial data
 */
function get (id) {
  const tutorialsJson = list.getJson()
  let tutorialId = id

  if (typeof id === 'object') {
    tutorialId = _.findKey(tutorialsJson, tutorial => tutorial.url === id.url)
  }

  const formattedId = getFormattedId(tutorialId)

  if (!tutorialsJson[formattedId]) {
    throw errorCode(new Error(`NOT FOUND: Tutorial with id ${id} not found.`), 'NOT_FOUND')
  }

  const tutorial = { ...tutorialsJson[formattedId] }

  // populate object with more data
  tutorial.id = getId(tutorialId)
  tutorial.formattedId = formattedId
  tutorial.shortTitle = utils.deriveShortname(tutorial.url)
  tutorial.folderName = `${tutorial.formattedId}-${tutorial.url}`
  tutorial.fullPath = path.resolve(`${config.tutorialsPath}/${tutorial.folderName}`)
  tutorial.lessons = getLessons(tutorial)
  tutorial.project = projectsApi.get(tutorial.project)

  debug && log.debug(logGroup('get'), tutorial)

  return tutorial
}

function getByUrl (url) {
  const tutorialsList = list.getJson()

  const tutorial = get(Object.values(tutorialsList).find(tutorial => tutorial.url === url))
  debug && log.debug(logGroup('getByUrl'), url, tutorial)

  if (!tutorial) {
    throw new Error(`NOT FOUND: Tutorial with url ${url} not found.`)
  }

  return tutorial
}

function getLessons (tutorial, lessons = [], lessonId = 1) {
  let lesson

  try {
    lesson = lessonsApi.get(tutorial, lessonId)
  } catch (error) {
    // lesson not found, we reached the end
    if (error.code === 'NOT_FOUND') {
      return lessons
    }

    throw error
  }

  lessons.push(lesson)

  return getLessons(tutorial, lessons, lessonId + 1)
}

function getFolderName (id, url) {
  const urlSuffix = url || (list.getJson())[getFormattedId(id)].url

  return `${getFormattedId(id)}-${urlSuffix}`
}

function getFullPath (id, url) {
  return path.resolve(config.tutorialsPath, getFolderName(id, url))
}

/**
 * Creates a new tutorial.
 *
 * 1. Creates tutorial folder in tutorials directory
 * 2. Adds a new entry to the tutorials static file
 *
 * @param {Object} data Tutorial data (mandatory: `title`, `url`, `project`  and `description`)
 * @returns New Tutorial object
 *
 * @example
 * api.tutorials.create({
 *    title: 'libp2p Peers',
 *    url: 'libp2p-peers',
 *    project: 'libp2p',
 *    description: 'Learn how peers interact with each other in libp2p.'
 * })
 */
function create (data) {
  const newTutorialId = getNextTutorialId()

  debug && log.debug(logGroup('create'), newTutorialId, data.url)

  // create new directory
  fs.mkdirSync(getFullPath(newTutorialId, data.url))

  const tutorial = {
    id: newTutorialId,
    formattedId: getFormattedId(newTutorialId),
    url: data.url,
    project: data.project,
    title: data.title,
    description: data.description || '',
    newMessage: data.newMessage || '',
    updateMessage: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    resources: []
  }

  list.add(tutorial)

  return get(newTutorialId)
}

function remove (id) {
  // delete tutorial folder
  del.sync(getFullPath(id))

  const tutorials = list.getJson()

  debug && log.debug(logGroup('remove'), id, tutorials[getFormattedId(id)].url)

  // delete tutorial metadata from static file
  delete tutorials[getFormattedId(id)]
  utils.writeStaticFile(STATIC_FILE, tutorials)
}

const list = {}

list.getStaticPath = function getStaticPath () {
  return path.resolve(config.staticPath, STATIC_FILE)
}

list.getJson = function getJson () {
  const tutorialsJson = fs.readFileSync(list.getStaticPath(), 'utf8')

  return JSON.parse(tutorialsJson)
}

list.get = function listGet () {
  const tutorialsJson = list.getJson()
  const tutorials = {}

  for (let id in tutorialsJson) {
    tutorials[id] = get(tutorialsJson[id])
  }

  return tutorials
}

list.getLatest = function getLatest () {
  const tutorials = list.get()

  return Object.values(tutorials)
    .sort((tutorial1, tutorial2) => tutorial2.id - tutorial1.id)[0]
}

list.add = function listAdd (data) {
  const tutorials = list.getJson()

  tutorials[data.formattedId] = data

  utils.writeStaticFile(STATIC_FILE, tutorials)
}

module.exports = {
  STATIC_FILE,

  // methods
  getFormattedId,
  getId,
  get,
  getByUrl,
  getFolderName,
  getFullPath,
  getLessons,
  getNextTutorialId,
  create,
  remove,
  list
}
