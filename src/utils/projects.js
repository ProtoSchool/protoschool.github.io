import data from '../static/projects.json'

// Populate data with more properties
data.forEach(project => {
  project.logo = require(`../static/images/projects/${project.id}.svg`)
})

export function get (id) {
  return getAll().find(project => project.id === id)
}

export function getAll () {
  return data
}

export function getNewsletters () {
  return getAll().filter(project => project.hasOwnProperty('newsletterUrl'))
}

export default {
  get,
  getAll,
  getNewsletters
}
