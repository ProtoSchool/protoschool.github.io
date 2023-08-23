import { tutorials } from '../../../src/api'
import { restoreData } from '../../../jest/helpers/setup'
import { generateTutorial, generateResource } from '../../../jest/helpers/fixtures'
import { assertNewTutorial, assertNewResource } from '../helpers/asserts'
import { protowizard } from '../helpers/runners'

describe('protowizard', () => {
  let lastTutorialId

  beforeAll(() => {
    lastTutorialId = tutorials.list.getLatest().id
  })

  afterEach(() => {
    restoreData(lastTutorialId)
  })

  describe('3. create resource', () => {
    test('3.1. should create resource after creating a new tutorial (skips lesson creation)', async () => {
      const { tutorial, resources, expected } = generateTutorial({
        resources: 1
      })

      await protowizard([
        { type: 'resource' },
        { confirm: false }, // no add to latest tutorial
        { tutorialId: 'new' }, // choose to create a new tutorial
        tutorial,
        resources[0],
        { confirm: false }, // no to create another resource
        { confirm: false } // no to create first lesson
      ])

      const result = tutorials.getByUrl(tutorial.url)

      expect(result.resources).toHaveLength(1)

      assertNewTutorial({
        context: { lastTutorialId },
        expected,
        result
      })
    })

    test('3.2. should create a resource and add it to the latest tutorial (skips lesson creation)', async () => {
      const { resource, tutorial, expected } = generateResource({ createTutorial: true })

      await protowizard([
        { type: 'resource' },
        { latestTutorial: true }, // yes add to latest tutorial
        resource,
        { confirm: false }, // no to create another resource
        { confirm: false } // no to create first lesson
      ])

      const result = tutorials.get(tutorial.id)

      expect(result.resources).toHaveLength(1)

      assertNewResource({
        expected,
        result
      })
    })
  })
})
