const setup = require('../../../jest/helpers/setup')
const fixtures = require('../../../jest/helpers/fixtures')
const api = require('../../api')
const asserts = require('./helpers/asserts')

describe('api', () => {
  let lastTutorialId

  beforeAll(() => {
    lastTutorialId = (api.tutorials.list.getLatest()).id
  })

  afterEach(() => {
    setup.restoreData(lastTutorialId)
  })

  describe('2 api.lessons', () => {
    describe('2.1 api.lessons.create(tutorial, data)', () => {
      test('2.1.1 create text lesson', () => {
        const { lesson, tutorial } = fixtures.generateLesson({ createTutorial: true })
        const result = api.lessons.create(tutorial, lesson)

        expect(api.tutorials.get(tutorial.id).lessons).toHaveLength(1)
        asserts.assertLesson(result, lesson)
      })

      test('2.1.2 create multiple-choice lesson', () => {
        const { lesson, tutorial } = fixtures.generateLesson({
          override: { type: 'multiple-choice' },
          createTutorial: true
        })
        const result = api.lessons.create(tutorial, lesson)

        expect(api.tutorials.get(tutorial.id).lessons).toHaveLength(1)
        asserts.assertLesson(result, lesson)
      })

      test('2.1.3 create code lesson', () => {
        const { lesson, tutorial } = fixtures.generateLesson({
          override: { type: 'code' },
          createTutorial: true
        })
        const result = api.lessons.create(tutorial, lesson)

        expect(api.tutorials.get(tutorial.id).lessons).toHaveLength(1)
        asserts.assertLesson(result, lesson)
      })

      test('2.1.4 create file-upload lesson', () => {
        const { lesson, tutorial } = fixtures.generateLesson({
          override: { type: 'file-upload' },
          createTutorial: true
        })
        const result = api.lessons.create(tutorial, lesson)

        expect(api.tutorials.get(tutorial.id).lessons).toHaveLength(1)
        asserts.assertLesson(result, lesson)
      })
    })
  })
})
