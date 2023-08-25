import { courses, tutorials } from '../../src/api'

export function restoreData (lastTutorialId) {
  const newLastTutorialId = tutorials.list.getLatest().id

  // delete all new tutorials
  for (let id = lastTutorialId + 1; id <= newLastTutorialId; id++) {
    tutorials.remove(id)
    courses.remove(id)
  }
}
