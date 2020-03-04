import data from '../static/projects.json'

// Populate data with more properties
data.forEach(project => {
  project.logo = require(`../static/images/projects/${project.id}.svg`)
})

function get (id) {
  return getAll().find(project => project.id === id)
}

function getAll () {
  return data
}

export default {
  get,
  getAll
}
