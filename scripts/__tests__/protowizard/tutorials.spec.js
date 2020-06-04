const api = require('../../../src/api')
const setup = require('../../../jest/helpers/setup')
const fixtures = require('../../../jest/helpers/fixtures')
const asserts = require('../helpers/asserts')
const runners = require('../helpers/runners')

describe('protowizard', () => {
  let lastTutorialId

  beforeAll(async () => {
    lastTutorialId = (await api.tutorials.list.getLatest()).id
  })

  afterEach(async () => {
    await setup.restoreData(lastTutorialId)
  })

  describe('1. create tutorial', () => {
    test('1.1. should create tutorial (skips lesson creation)', async () => {
      const { tutorial, expected } = await fixtures.generateTutorial()

      await runners.protowizard([
        { type: 'tutorial' },
        tutorial,
        { confirm: false } // no to create first lesson
      ])

      asserts.assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result: await api.tutorials.getByUrl(tutorial.url)
      })
    })

    test('1.2. should create tutorial with one text lesson', async () => {
      const { tutorial, lessons, expected } = await fixtures.generateTutorial({
        lessons: 1
      })

      await runners.protowizard([
        { type: 'tutorial' },
        tutorial,
        { confirm: true }, // yes to create the first lesson
        lessons[0],
        { confirm: false }, // no to create another lesson
        { confirm: false } // no to create the first resource
      ])

      asserts.assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result: await api.tutorials.getByUrl(tutorial.url)
      })
    })

    test('1.3. should create tutorial with two text lessons', async () => {
      const { tutorial, lessons, expected } = await fixtures.generateTutorial({
        lessons: 2
      })

      await runners.protowizard([
        { type: 'tutorial' },
        tutorial,
        { confirm: true }, // yes to create the first lesson
        lessons[0],
        { confirm: true }, // yes to create another lesson
        lessons[1],
        { confirm: false }, // no to create another lesson
        { confirm: false } // no to create the first resource
      ])

      asserts.assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result: await api.tutorials.getByUrl(tutorial.url)
      })
    })

    test('1.4. should create tutorial with one lesson and one resource', async () => {
      const { tutorial, lessons, resources, expected } = await fixtures.generateTutorial({
        lessons: 1,
        resources: 1
      })

      await runners.protowizard([
        { type: 'tutorial' },
        tutorial,
        { confirm: true }, // yes to create the first lesson
        lessons[0],
        { confirm: false }, // no to create another lesson
        { confirm: true }, // yes to create the first resource
        resources[0],
        { confirm: false } // no to create another resource
      ])

      asserts.assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result: await api.tutorials.getByUrl(tutorial.url)
      })
    })

    test('1.5. should create tutorial with one lesson and two resources', async () => {
      const { tutorial, lessons, resources, expected } = await fixtures.generateTutorial({
        lessons: 1,
        resources: 2
      })

      await runners.protowizard([
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

      asserts.assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result: await api.tutorials.getByUrl(tutorial.url)
      })
    })

    test('1.6. should not allow to create two tutorials with the same title or url', async () => {
      const { tutorial } = await fixtures.generateTutorial()

      await runners.protowizard([
        { type: 'tutorial' },
        tutorial,
        { confirm: false } // no to create first lesson
      ])

      await expect(
        runners.protowizard([
          { type: 'tutorial' },
          tutorial,
          { confirm: false } // no to create first lesson
        ])
      ).rejects.toThrow('INQUIRER VALIDATION FAILED')
    })
  })
})
