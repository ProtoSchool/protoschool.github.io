import { readFileSync } from 'fs'
import { resolve } from 'path'

import { staticPath } from '../config.js'
import { writeStaticFile } from '../utils.js'
import { getFormattedId } from './tutorials.js'

const STATIC_FILE = 'courses.json'

export function getStaticPath () {
  return resolve(staticPath, STATIC_FILE)
}

export function get () {
  const coursesJson = readFileSync(getStaticPath(), 'utf8')

  return JSON.parse(coursesJson)
}

export function getAll () {
  return get().all
}

export function getFeatured () {
  return get().featured
}

export function getCourseNames () {
  return Object.keys(get()).filter(course => (course !== 'all' && course !== 'featured'))
}

export function save (courses) {
  writeStaticFile(STATIC_FILE, courses)
}

export function add (id) {
  const formattedId = getFormattedId(id)
  const courses = get()

  if (courses.all.find(courseId => courseId === formattedId)) {
    return
  }

  courses.all.push(formattedId)

  save(courses)
}

export async function remove (id) {
  const tutorialFormattedId = getFormattedId(id)
  const courses = get()

  courses.all = courses.all.filter(courseId => courseId !== tutorialFormattedId)
  courses.featured = courses.featured.filter(courseId => courseId !== tutorialFormattedId)

  writeStaticFile(STATIC_FILE, courses)
}
