import setup from '../../../jest/helpers/setup'
import fixtures from '../../../jest/helpers/fixtures'
import { tutorials, projects, _config } from '../'
import { assertTutorial } from './helpers/asserts'

describe('api', () => {
  let lastTutorialId

  beforeAll(() => {
    lastTutorialId = tutorials.list.getLatest().id
  })

  afterAll(() => {
    setup.restoreData(lastTutorialId)
  })

  describe('1 api.tutorials', () => {
    test('1.1 api.tutorials.getNextTutorialId()', () => {
      expect(tutorials.getNextTutorialId()).toEqual(lastTutorialId + 1)
    })

    test('1.2 api.tutorials.getFormattedId(id)', () => {
      expect(tutorials.getFormattedId(4)).toEqual('0004')
      expect(tutorials.getFormattedId(35)).toEqual('0035')
      expect(tutorials.getFormattedId('4')).toEqual('0004')
      expect(tutorials.getFormattedId('04')).toEqual('0004')
      expect(tutorials.getFormattedId('0004')).toEqual('0004')
    })

    test('1.3 api.tutorials.getId(formattedId)', () => {
      expect(tutorials.getId('0004')).toEqual(4)
      expect(tutorials.getId('0035')).toEqual(35)
      expect(tutorials.getId('4')).toEqual(4)
      expect(tutorials.getId('04')).toEqual(4)
      expect(tutorials.getId('0004')).toEqual(4)
    })

    test('1.4 api.tutorials.get(id)', () => {
      const { tutorial } = fixtures.generateTutorial()
      const createResult = tutorials.create(tutorial)
      const result = tutorials.get(createResult.id)

      expect(result).toMatchObject({
        ...tutorial,
        project: projects.get(tutorial.project)
      })
      expect(result).toEqual(createResult)

      expect(() => tutorials.get(0)).toThrow('not found')

      try {
        tutorials.get(0)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toEqual(expect.stringContaining('not found'))
        expect(error.code).toEqual('NOT_FOUND')
      }
    })

    test('1.5 api.tutorials.getByUrl(url)', () => {
      const { tutorial } = fixtures.generateTutorial()

      const result = tutorials.create(tutorial)

      expect(
        tutorials.getByUrl(result.url)
      ).toEqual(
        tutorials.get(result.id)
      )
    })

    test('1.6 api.tutorials.getLessons(id)', () => {
      const tutorial = fixtures.createTutorial({ lessons: 4 })

      const lessonsResult = tutorials.getLessons(tutorials.get(tutorial.id))

      expect(lessonsResult).toHaveLength(4)
      expect(lessonsResult).toEqual(tutorial.lessons)
    })

    test('1.7 api.tutorials.getFolderName(id, url)', () => {
      const { tutorial } = fixtures.generateTutorial()
      const result = tutorials.create(tutorial)

      expect(tutorials.getFolderName(result.id)).toEqual(result.folderName)
      expect(result.folderName).toEqual(
        `${tutorials.getFormattedId(result.id)}-${tutorial.url}`
      )
      expect(tutorials.getFolderName(result.id)).toEqual(
        `${tutorials.getFormattedId(result.id)}-${tutorial.url}`
      )
      expect(tutorials.getFolderName(result.id, tutorial.url)).toEqual(
        `${tutorials.getFormattedId(result.id)}-${tutorial.url}`
      )
    })

    test('1.8 api.tutorials.getFullPath(id, url)', () => {
      const { tutorial } = fixtures.generateTutorial()
      const result = tutorials.create(tutorial)

      expect(result.fullPath).toEqual(
        expect.stringContaining(`${_config.tutorialsPath}/${tutorials.getFolderName(result.id)}`)
      )
      expect(tutorials.getFullPath(result.id)).toEqual(result.fullPath)
      expect(tutorials.getFullPath(result.id)).toEqual(
        expect.stringContaining(`${_config.tutorialsPath}/${tutorials.getFolderName(result.id)}`)
      )
      expect(tutorials.getFullPath(result.id, tutorial.url)).toEqual(
        expect.stringContaining(`${_config.tutorialsPath}/${tutorials.getFolderName(result.id)}`)
      )
    })

    test('1.9 api.tutorials.create(data)', () => {
      const { tutorial } = fixtures.generateTutorial()
      const result = tutorials.create(tutorial)

      assertTutorial(result, tutorial)
    })

    test('1.10 api.tutorials.remove(id)', () => {
      const { tutorial } = fixtures.generateTutorial()
      const result = tutorials.create(tutorial)

      tutorials.remove(result.id)

      expect(() => tutorials.get(result.id)).toThrow('not found')
    })

    describe('1.11 api.tutorials.list', () => {
      test.todo('1.13.1 api.tutorials.list.getStaticPath()')
      test.todo('1.13.2 api.tutorials.list.getJson()')
      test.todo('1.13.3 api.tutorials.list.get()')
      test.todo('1.13.4 api.tutorials.list.getLatest()')
      test.todo('1.13.5 api.tutorials.list.add(data)')
    })
  })
})
