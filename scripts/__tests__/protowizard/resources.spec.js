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

  describe('3. create resource', () => {
    afterEach(async () => {
      await setup.restoreData(lastTutorialId)
    })

    test('3.1. should create resource after creating a new tutorial (skips lesson creation)', async () => {
      const { tutorial, resources, expected } = await fixtures.generateTutorial({
        resources: 1
      })

      await runners.protowizard([
        { type: 'resource' },
        { confirm: false }, // no add to latest tutorial
        { tutorialId: 'new' }, // choose to create a new tutorial
        tutorial,
        resources[0],
        { confirm: false }, // no to create another resource
        { confirm: false } // no to create first lesson
      ])

      const result = await api.tutorials.getByUrl(tutorial.url)

      expect(result.resources).toHaveLength(1)

      asserts.assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result
      })
    })

    test('3.2. should create a resource and add it to the latest tutorial (skips lesson creation)', async () => {
      const { resource, tutorial, expected } = await fixtures.generateResource({ createTutorial: true })

      await runners.protowizard([
        { type: 'resource' },
        { latestTutorial: true }, // yes add to latest tutorial
        resource,
        { confirm: false }, // no to create another resource
        { confirm: false } // no to create first lesson
      ])

      const result = await api.tutorials.get(tutorial.id)

      expect(result.resources).toHaveLength(1)

      asserts.assertNewResource({
        expected,
        result
      })
    })
  })
})
