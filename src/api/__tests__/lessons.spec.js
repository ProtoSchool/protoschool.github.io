const setup = require('../../../jest/helpers/setup')
const fixtures = require('../../../jest/helpers/fixtures')
const api = require('../../api')
const asserts = require('./helpers/asserts')

describe('api', () => {
  let lastTutorialId

  beforeAll(async () => {
    lastTutorialId = (await api.tutorials.list.getLatest()).id
  })

  afterEach(async () => {
    await setup.restoreData(lastTutorialId)
  })

  describe('2 api.lessons', () => {
    test('2.1 api.lessons.create(tutorial, data) - text', async () => {
      const { lesson, tutorial } = await fixtures.generateLesson({ createTutorial: true })
      const result = await api.lessons.create(tutorial, lesson)

      expect((await api.tutorials.get(tutorial.id)).lessons).toHaveLength(1)
      await asserts.assertLesson(result, lesson)
    })

    test('2.2 api.lessons.create(tutorial, data) - multiple-choice', async () => {
      const { lesson, tutorial } = await fixtures.generateLesson({
        override: { type: 'multiple-choice' },
        createTutorial: true
      })
      const result = await api.lessons.create(tutorial, lesson)

      expect((await api.tutorials.get(tutorial.id)).lessons).toHaveLength(1)
      await asserts.assertLesson(result, lesson)
    })

    test('2.3 api.lessons.create(tutorial, data) - code', async () => {
      const { lesson, tutorial } = await fixtures.generateLesson({
        override: { type: 'code' },
        createTutorial: true
      })
      const result = await api.lessons.create(tutorial, lesson)

      expect((await api.tutorials.get(tutorial.id)).lessons).toHaveLength(1)
      await asserts.assertLesson(result, lesson)
    })

    test('2.4 api.lessons.create(tutorial, data) - file-upload', async () => {
      const { lesson, tutorial } = await fixtures.generateLesson({
        override: { type: 'file-upload' },
        createTutorial: true
      })
      const result = await api.lessons.create(tutorial, lesson)

      expect((await api.tutorials.get(tutorial.id)).lessons).toHaveLength(1)
      await asserts.assertLesson(result, lesson)
    })
  })
})
