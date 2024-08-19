import { tutorials } from '../../../src/api'
import { restoreData } from '../../../jest/helpers/setup'
import { generateTutorial } from '../../../jest/helpers/fixtures'
import { assertNewTutorial } from '../helpers/asserts'
import { protowizard } from '../helpers/runners'

describe('protowizard', () => {
  let lastTutorialId

  beforeAll(() => {
    lastTutorialId = tutorials.list.getLatest().id
  })

  afterEach(() => {
    restoreData(lastTutorialId)
  })

  describe('1. create tutorial', () => {
    test('1.1. should create tutorial (skips lesson creation)', async () => {
      const { tutorial, expected } = generateTutorial()

      await protowizard([
        { type: 'tutorial' },
        tutorial,
        { confirm: false } // no to create first lesson
      ])

      assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result: tutorials.getByUrl(tutorial.url)
      })
    })

    test('1.2. should create tutorial with one text lesson', async () => {
      const { tutorial, lessons, expected } = generateTutorial({
        lessons: 1
      })

      await protowizard([
        { type: 'tutorial' },
        tutorial,
        { confirm: true }, // yes to create the first lesson
        lessons[0],
        { confirm: false }, // no to create another lesson
        { confirm: false } // no to create the first resource
      ])

      assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result: tutorials.getByUrl(tutorial.url)
      })
    })

    test('1.3. should create tutorial with two text lessons', async () => {
      const { tutorial, lessons, expected } = generateTutorial({
        lessons: 2
      })

      await protowizard([
        { type: 'tutorial' },
        tutorial,
        { confirm: true }, // yes to create the first lesson
        lessons[0],
        { confirm: true }, // yes to create another lesson
        lessons[1],
        { confirm: false }, // no to create another lesson
        { confirm: false } // no to create the first resource
      ])

      assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result: tutorials.getByUrl(tutorial.url)
      })
    })

    test('1.4. should create tutorial with one lesson and one resource', async () => {
      const { tutorial, lessons, resources, expected } = generateTutorial({
        lessons: 1,
        resources: 1
      })

      await protowizard([
        { type: 'tutorial' },
        tutorial,
        { confirm: true }, // yes to create the first lesson
        lessons[0],
        { confirm: false }, // no to create another lesson
        { confirm: true }, // yes to create the first resource
        resources[0],
        { confirm: false } // no to create another resource
      ])

      assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result: tutorials.getByUrl(tutorial.url)
      })
    })

    test('1.5. should create tutorial with one lesson and two resources', async () => {
      const { tutorial, lessons, resources, expected } = generateTutorial({
        lessons: 1,
        resources: 2
      })

      await protowizard([
        { type: 'tutorial' },
        tutorial,
        { confirm: true }, // yes to create the first lesson
        lessons[0],
        { confirm: false }, // no to create another lesson
        { confirm: true }, // yes to create the first resource
        resources[0],
        { confirm: true }, // yes to create another resource
        resources[1],
        { confirm: false } // no to create another resource
      ])

      assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result: tutorials.getByUrl(tutorial.url)
      })
    })

    test('1.6. should not allow to create two tutorials with the same title or url', async () => {
      const { tutorial } = generateTutorial()

      await protowizard([
        { type: 'tutorial' },
        tutorial,
        { confirm: false } // no to create first lesson
      ])

      await expect(
        protowizard([
          { type: 'tutorial' },
          tutorial,
          { confirm: false } // no to create first lesson
        ])
      ).rejects.toThrow('INQUIRER VALIDATION FAILED')
    })
  })
})
