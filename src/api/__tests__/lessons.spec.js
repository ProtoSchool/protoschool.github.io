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
    describe('2.1 api.lessons.create(tutorial, data)', () => {
      test('2.1.1 create text lesson', async () => {
        const { lesson, tutorial } = await fixtures.generateLesson({ createTutorial: true })
        const result = await api.lessons.create(tutorial, lesson)

        expect((await api.tutorials.get(tutorial.id)).lessons).toHaveLength(1)
        await asserts.assertLesson(result, lesson)
      })

      test('2.1.2 create multiple-choice lesson', async () => {
        const { lesson, tutorial } = await fixtures.generateLesson({
          override: { type: 'multiple-choice' },
          createTutorial: true
        })
        const result = await api.lessons.create(tutorial, lesson)

        expect((await api.tutorials.get(tutorial.id)).lessons).toHaveLength(1)
        await asserts.assertLesson(result, lesson)
      })

      test('2.1.3 create code lesson', async () => {
        const { lesson, tutorial } = await fixtures.generateLesson({
          override: { type: 'code' },
          createTutorial: true
        })
        const result = await api.lessons.create(tutorial, lesson)

        expect((await api.tutorials.get(tutorial.id)).lessons).toHaveLength(1)
        await asserts.assertLesson(result, lesson)
      })

      test('2.1.4 create file-upload lesson', async () => {
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
})
