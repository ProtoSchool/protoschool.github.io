const fs = require('fs').promises
const path = require('path')

const config = require('../config')
const utils = require('../utils')
const tutorials = require('./tutorials')

const STATIC_FILE = 'courses.json'

function getStaticPath () {
  return path.resolve(config.staticPath, STATIC_FILE)
}

async function get () {
  const coursesJson = await fs.readFile(getStaticPath(), 'utf8')

  return JSON.parse(coursesJson)
}

async function getAll () {
  return (await get()).all
}

async function getFeatured () {
  return (await get()).featured
}

async function save (courses) {
  await utils.writeStaticFile(STATIC_FILE, courses)
}

async function add (id) {
  const formattedId = tutorials.getFormattedId(id)
  const courses = await get()

  if (courses.all.find(courseId => courseId === formattedId)) {
    return
  }

  courses.all.push(formattedId)

  await save(courses)
}

async function remove (id) {
  const tutorialFormattedId = tutorials.getFormattedId(id)
  const courses = await get()

  courses.all = courses.all.filter(courseId => courseId !== tutorialFormattedId)
  courses.featured = courses.featured.filter(courseId => courseId !== tutorialFormattedId)

  await utils.writeStaticFile(STATIC_FILE, courses)
}

module.exports = {
  getStaticPath,
  get,
  getAll,
  getFeatured,
  save,
  add,
  remove
}
