import { readFileSync } from 'fs'
import { resolve } from 'path'

import { staticPath } from '../config'
import utils from '../utils'
import { getFormattedId } from './tutorials'

const STATIC_FILE = 'courses.json'

function getStaticPath () {
  return resolve(staticPath, STATIC_FILE)
}

function get () {
  const coursesJson = readFileSync(getStaticPath(), 'utf8')

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
  const formattedId = getFormattedId(id)
  const courses = get()

  if (courses.all.find(courseId => courseId === formattedId)) {
    return
  }

  courses.all.push(formattedId)

  save(courses)
}

async function remove (id) {
  const tutorialFormattedId = getFormattedId(id)
  const courses = get()

  courses.all = courses.all.filter(courseId => courseId !== tutorialFormattedId)
  courses.featured = courses.featured.filter(courseId => courseId !== tutorialFormattedId)

  utils.writeStaticFile(STATIC_FILE, courses)
}

export default {
  getStaticPath,
  get,
  getAll,
  getFeatured,
  getCourseNames,
  save,
  add,
  remove
}
