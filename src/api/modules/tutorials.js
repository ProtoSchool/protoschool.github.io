/**
 * Tutorials module which includes all CRUD operations for tutorials.
 *
 * @module api/tutorials
 */

const fs = require('fs').promises
const path = require('path')

const errorCode = require('err-code')
const _ = require('lodash')
const del = require('del')

const log = require('../logger')
const debug = require('../../utils/debug')
const config = require('../config')
const utils = require('../utils')
const lessonsApi = require('./lessons')
const projectsApi = require('./projects')

const STATIC_FILE = 'tutorials.json'

const logGroup = functionMethod => `[tutorials.${functionMethod}()]`

async function getNextTutorialId () {
  return (await list.getLatest()).id + 1
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
async function get (id) {
  const tutorialsJson = await list.getJson()
  let tutorialId = id

  if (typeof id === 'object') {
    tutorialId = _.findKey(tutorialsJson, tutorial => tutorial.url === id.url)
  }

  if (!tutorialId) {
    throw errorCode(new Error(`NOT FOUND: Tutorial with id ${id} not found.`), 'NOT_FOUND')
  }

  const formattedId = getFormattedId(tutorialId)
  const tutorial = { ...tutorialsJson[formattedId] }

  // populate object with more data
  tutorial.id = getId(tutorialId)
  tutorial.formattedId = formattedId
  tutorial.shortTitle = utils.deriveShortname(tutorial.url)
  tutorial.folderName = `${tutorial.formattedId}-${tutorial.url}`
  tutorial.fullPath = path.resolve(`${config.tutorialsPath}/${tutorial.folderName}`)
  tutorial.lessons = await getLessons(tutorial)
  tutorial.project = await projectsApi.get(tutorial.project)

  debug && log.debug(logGroup('get'), tutorial)

  return tutorial
}

async function getByUrl (url) {
  const tutorialsList = await list.getJson()

  const tutorial = await get(Object.values(tutorialsList).find(tutorial => tutorial.url === url))
  debug && log.debug(logGroup('getByUrl'), url, tutorial)

  if (!tutorial) {
    throw new Error(`NOT FOUND: Tutorial with url ${url} not found.`)
  }

  return tutorial
}

async function getLessons (tutorial, lessons = [], lessonId = 1) {
  let lesson

  try {
    lesson = await lessonsApi.get(tutorial, lessonId)
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

async function getFolderName (id, url) {
  const urlSuffix = url || (await list.getJson())[getFormattedId(id)].url

  return `${getFormattedId(id)}-${urlSuffix}`
}

async function getFullPath (id, url) {
  return path.resolve(`${config.tutorialsPath}/${(await getFolderName(id, url))}`)
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
 * await api.tutorials.create({
 *    title: 'libp2p Peers',
 *    url: 'libp2p-peers',
 *    project: 'libp2p',
 *    description: 'Learn how peers interact with each other in libp2p.'
 * })
 */
async function create (data) {
  const newTutorialId = await getNextTutorialId()

  debug && log.debug(logGroup('create'), newTutorialId, data.url)

  // create new directory
  await fs.mkdir(await getFullPath(newTutorialId, data.url))

  const tutorial = {
    id: newTutorialId,
    formattedId: getFormattedId(newTutorialId),
    url: data.url,
    project: data.project,
    title: data.title,
    description: data.description,
    newMessage: '',
    updateMessage: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    resources: []
  }

  await list.add(tutorial)

  return get(newTutorialId)
}

async function remove (id) {
  // delete tutorial folder
  await del((await getFullPath(id)))

  const tutorials = await list.getJson()

  debug && log.debug(logGroup('remove'), id, tutorials[getFormattedId(id)].url)

  // delete tutorial metadata from static file
  delete tutorials[getFormattedId(id)]
  await utils.writeStaticFile(STATIC_FILE, tutorials)
}

const list = {}

list.getStaticPath = function getStaticPath () {
  return path.resolve(config.staticPath, STATIC_FILE)
}

list.getJson = async function getJson () {
  const tutorialsJson = await fs.readFile(list.getStaticPath(), 'utf8')

  return JSON.parse(tutorialsJson)
}

list.get = async function listGet () {
  const tutorialsJson = await list.getJson()
  const tutorials = {}

  for (let id in tutorialsJson) {
    tutorials[id] = await get(tutorialsJson[id])
  }

  return tutorials
}

list.getLatest = async function getLatest () {
  const tutorials = await list.get()

  return Object.values(tutorials)
    .sort((tutorial1, tutorial2) => tutorial2.id - tutorial1.id)[0]
}

list.add = async function listAdd (data) {
  const tutorials = await list.getJson()

  tutorials[data.formattedId] = data

  await utils.writeStaticFile(STATIC_FILE, tutorials)
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
