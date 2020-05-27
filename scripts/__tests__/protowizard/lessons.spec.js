const api = require('../../../src/api')
const setup = require('../../../jest/helpers/setup')
const asserts = require('../helpers/asserts')
const fixtures = require('../helpers/fixtures')
const runners = require('../helpers/runners')

describe('protowizard', () => {
  let lastTutorialId

  beforeAll(async () => {
    lastTutorialId = (await api.tutorials.list.getLatest()).id
  })

  describe('2. create lesson', () => {
    afterEach(async () => {
      await setup.restoreData(lastTutorialId)
    })

    test('2.1. should create lesson after creating a new tutorial (skips resource creation)', async () => {
      const { tutorial, lessons, expected } = await fixtures.generateTutorial({
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

      const result = await api.tutorials.getByUrl(tutorial.url)

      expect(result.lessons).toHaveLength(1)

      asserts.assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result
      })
    })

    test('2.2. should create a lesson and add it to the latest tutorial (skips resource creation)', async () => {
      const { lesson, tutorial, expected } = await fixtures.generateLesson({ createTutorial: true })

      await runners.protowizard([
        { type: 'lesson' },
        { latestTutorial: true }, // yes add to latest tutorial
        lesson,
        { confirm: false }, // no to create another lesson
        { confirm: false } // no to create first resource
      ])

      asserts.assertNewLesson({
        expected,
        result: await api.tutorials.getByUrl(tutorial.url)
      })
    })
  })
})
