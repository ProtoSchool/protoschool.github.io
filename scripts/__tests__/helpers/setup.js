const api = require('../../../src/api')

async function restoreData (lastTutorialId) {
  const newLastTutorialId = (await api.tutorials.list.getLatest()).id

  // delete all new tutorials
  for (let id = lastTutorialId + 1; id <= newLastTutorialId; id++) {
    await api.tutorials.remove(id)
    await api.courses.remove(id)
  }
}

module.exports = {
  restoreData
}
