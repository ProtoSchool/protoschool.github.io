const api = require('../../../src/api')
const setup = require('../../../jest/helpers/setup')
const fixtures = require('../../../jest/helpers/fixtures')
const asserts = require('../helpers/asserts')
const runners = require('../helpers/runners')

describe('protowizard', () => {
  let lastTutorialId

  beforeAll(() => {
    lastTutorialId = api.tutorials.list.getLatest().id
  })

  afterEach(() => {
    setup.restoreData(lastTutorialId)
  })

  describe('2. create lesson', () => {
    test('2.1. should create lesson after creating a new tutorial (skips resource creation)', async () => {
      const { tutorial, lessons, expected } = fixtures.generateTutorial({
        lessons: 1
      })

      await runners.protowizard([
        { type: 'lesson' },
        { confirm: false }, // no add to latest tutorial
        { tutorialId: 'new' }, // choose to create a new tutorial
        tutorial,
        lessons[0],
        { confirm: false }, // no to create another lesson
        { confirm: false } // no to create first resource
      ])

      const result = api.tutorials.getByUrl(tutorial.url)

      expect(result.lessons).toHaveLength(1)

      asserts.assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result
      })
    })

    test('2.2. should create a lesson and add it to the latest tutorial (skips resource creation)', async () => {
      const { lesson, tutorial, expected } = fixtures.generateLesson({ createTutorial: true })

      await runners.protowizard([
        { type: 'lesson' },
        { latestTutorial: true }, // yes add to latest tutorial
        lesson,
        { confirm: false }, // no to create another lesson
        { confirm: false } // no to create first resource
      ])

      asserts.assertNewLesson({
        expected,
        result: api.tutorials.getByUrl(tutorial.url)
      })
    })

    test('2.3. should list the lessons created so far', async () => {
      const tutorial = fixtures.createTutorial({ lessons: 4 })

      expect(tutorial.lessons).toHaveLength(4)

      await runners.protowizard([
        { type: 'lesson' },
        { latestTutorial: true }, // yes add to latest tutorial
        fixtures.generateLesson().lesson,
        { confirm: false }, // no to create another lesson
        { confirm: false } // no to create first resource
      ])
    })
  })
})
