import { tutorials } from '../../../src/api'
import { restoreData } from '../../../jest/helpers/setup'
import { generateTutorial, generateLesson, createTutorial as _createTutorial } from '../../../jest/helpers/fixtures'
import { assertNewTutorial, assertNewLesson } from '../helpers/asserts'
import { protowizard } from '../helpers/runners'

describe('protowizard', () => {
  let lastTutorialId

  beforeAll(() => {
    lastTutorialId = tutorials.list.getLatest().id
  })

  afterEach(() => {
    restoreData(lastTutorialId)
  })

  describe('2. create lesson', () => {
    test('2.1. should create lesson after creating a new tutorial (skips resource creation)', async () => {
      const { tutorial, lessons, expected } = generateTutorial({
        lessons: 1
      })

      await protowizard([
        { type: 'lesson' },
        { confirm: false }, // no add to latest tutorial
        { tutorialId: 'new' }, // choose to create a new tutorial
        tutorial,
        lessons[0],
        { confirm: false }, // no to create another lesson
        { confirm: false } // no to create first resource
      ])

      const result = tutorials.getByUrl(tutorial.url)

      expect(result.lessons).toHaveLength(1)

      assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result
      })
    })

    test('2.2. should create a lesson and add it to the latest tutorial (skips resource creation)', async () => {
      const { lesson, tutorial, expected } = generateLesson({ createTutorial: true })

      await protowizard([
        { type: 'lesson' },
        { latestTutorial: true }, // yes add to latest tutorial
        lesson,
        { confirm: false }, // no to create another lesson
        { confirm: false } // no to create first resource
      ])

      assertNewLesson({
        expected,
        result: tutorials.getByUrl(tutorial.url)
      })
    })

    test('2.3. should list the lessons created so far', async () => {
      const tutorial = _createTutorial({ lessons: 4 })

      expect(tutorial.lessons).toHaveLength(4)

      await protowizard([
        { type: 'lesson' },
        { latestTutorial: true }, // yes add to latest tutorial
        generateLesson().lesson,
        { confirm: false }, // no to create another lesson
        { confirm: false } // no to create first resource
      ])
    })
  })
})
