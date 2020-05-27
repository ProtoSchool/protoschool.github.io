const setup = require('../../../jest/helpers/setup')
const api = require('../')
const { assertTutorial } = require('./helpers/asserts')

describe('api', () => {
  let lastTutorialId

  beforeAll(async () => {
    lastTutorialId = (await api.tutorials.list.getLatest()).id
  })

  afterAll(async () => {
    await setup.restoreData(lastTutorialId)
  })

  describe('1. tutorials', () => {
    test('1.1. create(data)', async () => {
      const tutorialDetails = {
        title: 'New Tutorial',
        url: `new-tut-${Math.random()}`,
        project: 'libp2p',
        description: 'New tutorial description'
      }

      const result = await api.tutorials.create(tutorialDetails)

      await assertTutorial(result, tutorialDetails)
    })
  })
})
