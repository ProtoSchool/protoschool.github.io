const fs = require('fs').promises

const api = require('../../')

function assertTutorialObject (result, expected) {
  expect(result).toMatchObject({
    ...expected,
    project: api.projects.get(expected.project)
  })
}

async function assertTutorial (result, tutorialDetails) {
  // assert against provided tutorial details
  assertTutorialObject(result, tutorialDetails)

  // assert against tutorial metadata on static file
  assertTutorialObject(result, (await api.tutorials.list.getJson())[result.formattedId])

  // assert correct folder was created
  expect((await fs.lstat(await api.tutorials.getFullPath(result.id))).isDirectory()).toBeTruthy()
}

module.exports = {
  assertTutorial
}
