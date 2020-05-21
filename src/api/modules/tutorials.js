const fs = require('fs').promises
const path = require('path')

const marked = require('meta-marked')
const del = require('del')

const log = require('../logger')
const debug = require('../../utils/debug')
const config = require('../config')
const utils = require('../utils')
const projects = require('./projects')

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

async function get (id) {
  const tutorial = (await list.get())[getFormattedId(id)]
  debug && log.debug(logGroup('get'), id, tutorial)

  if (!tutorial) {
    throw new Error(`ERROR NOT FOUND: Tutorial with id ${id} not found.`)
  }

  return tutorial
}

async function getByUrl (url) {
  const tutorialsList = await list.get()

  const tutorial = Object.values(tutorialsList).find(tutorial => tutorial.url === url)
  debug && log.debug(logGroup('getByUrl'), url, tutorial)

  if (!tutorial) {
    throw new Error(`ERROR NOT FOUND: Tutorial with url ${url} not found.`)
  }

  return tutorial
}

async function getLessons (id, lessons = [], lessonNumber = 1) {
  const lessonFilePrefix = `${(await getFolderName(id))}/${lessonNumber.toString().padStart(2, 0)}`

  let lessonMd
  let lesson

  try {
    lessonMd = await fs.readFile(path.resolve(config.tutorialsPath, `${lessonFilePrefix}.md`), 'utf8')
    lesson = {
      id: lessonNumber,
      formattedId: lessonNumber.toString().padStart(2, 0),
      ...marked(lessonMd).meta
    }
  } catch (error) {
    // lesson not found, we reached the end
    if (error.code === 'ENOENT') {
      return lessons
    }

    // data not well formatted
    if (error.name === 'YAMLException') {
      console.error(
        new Error(`Data improperly formatted in the lesson markdown file "${lessonFilePrefix}.md". Check that the YAML syntax is correct.`)
      )
    }
    throw error
  }

  lessons.push(lesson)

  return getLessons(id, lessons, lessonNumber + 1)
}

async function getFolderName (id, url) {
  const urlSuffix = url || (await list.getJson())[getFormattedId(id)].url

  return `${getFormattedId(id)}-${urlSuffix}`
}

async function getFullPath (id, url) {
  return path.resolve(`${config.tutorialsPath}/${(await getFolderName(id, url))}`)
}

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
    updatedAt: '',
    resources: []
  }

  await list.add(tutorial)

  return getByUrl(data.url)
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

  for (const formattedId in tutorialsJson) {
    tutorials[formattedId] = { ...tutorialsJson[formattedId] }
    tutorials[formattedId].formattedId = formattedId
    tutorials[formattedId].id = parseInt(formattedId, 10)
    tutorials[formattedId].shortTitle = utils.deriveShortname(tutorials[formattedId].url)
    tutorials[formattedId].lessons = await getLessons(tutorials[formattedId].id)
    tutorials[formattedId].project = await projects.get(tutorials[formattedId].project)
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

const json = {}

json.get = async function getJson () {
  const tutorialsJson = await fs.readFile(list.getStaticPath(), 'utf8')

  return JSON.parse(tutorialsJson)
}

json.update = async function updateJson (update) {
  const tutorials = await list.getJson()

  await utils.writeStaticFile(STATIC_FILE, update(tutorials))
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
  list,
  json
}
