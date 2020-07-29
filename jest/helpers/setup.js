const api = require('../../src/api')

function restoreData (lastTutorialId) {
  const newLastTutorialId = api.tutorials.list.getLatest().id

  // delete all new tutorials
  for (let id = lastTutorialId + 1; id <= newLastTutorialId; id++) {
    api.tutorials.remove(id)
    api.courses.remove(id)
  }
}

module.exports = {
  restoreData
}
