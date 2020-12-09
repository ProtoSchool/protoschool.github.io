const fs = require('fs')
const path = require('path')

const config = require('../config')
const utils = require('../utils')
const tutorials = require('./tutorials')

const STATIC_FILE = 'courses.json'

function getStaticPath () {
  return path.resolve(config.staticPath, STATIC_FILE)
}

function get () {
  const coursesJson = fs.readFileSync(getStaticPath(), 'utf8')

  return JSON.parse(coursesJson)
}

function getAll () {
  return get().all
}

function getFeatured () {
  return get().featured
}

function getCourseNames () {
  return Object.keys(get()).filter(course => (course !== 'all' && course !== 'featured'))
}

function save (courses) {
  utils.writeStaticFile(STATIC_FILE, courses)
}

function add (id) {
  const formattedId = tutorials.getFormattedId(id)
  const courses = get()

  if (courses.all.find(courseId => courseId === formattedId)) {
    return
  }

  courses.all.push(formattedId)

  save(courses)
}

async function remove (id) {
  const tutorialFormattedId = tutorials.getFormattedId(id)
  const courses = get()

  courses.all = courses.all.filter(courseId => courseId !== tutorialFormattedId)
  courses.featured = courses.featured.filter(courseId => courseId !== tutorialFormattedId)

  utils.writeStaticFile(STATIC_FILE, courses)
}

module.exports = {
  getStaticPath,
  get,
  getAll,
  getFeatured,
  getCourseNames,
  save,
  add,
  remove
}
