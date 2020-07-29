const setup = require('../../../jest/helpers/setup')
const fixtures = require('../../../jest/helpers/fixtures')
const api = require('../')
const { assertTutorial } = require('./helpers/asserts')

describe('api', () => {
  let lastTutorialId

  beforeAll(() => {
    lastTutorialId = api.tutorials.list.getLatest().id
  })

  afterAll(() => {
    setup.restoreData(lastTutorialId)
  })

  describe('1 api.tutorials', () => {
    test('1.1 api.tutorials.getNextTutorialId()', () => {
      expect(api.tutorials.getNextTutorialId()).toEqual(lastTutorialId + 1)
    })

    test('1.2 api.tutorials.getFormattedId(id)', () => {
      expect(api.tutorials.getFormattedId(4)).toEqual('0004')
      expect(api.tutorials.getFormattedId(35)).toEqual('0035')
      expect(api.tutorials.getFormattedId('4')).toEqual('0004')
      expect(api.tutorials.getFormattedId('04')).toEqual('0004')
      expect(api.tutorials.getFormattedId('0004')).toEqual('0004')
    })

    test('1.3 api.tutorials.getId(formattedId)', () => {
      expect(api.tutorials.getId('0004')).toEqual(4)
      expect(api.tutorials.getId('0035')).toEqual(35)
      expect(api.tutorials.getId('4')).toEqual(4)
      expect(api.tutorials.getId('04')).toEqual(4)
      expect(api.tutorials.getId('0004')).toEqual(4)
    })

    test('1.4 api.tutorials.get(id)', () => {
      const { tutorial } = fixtures.generateTutorial()
      const createResult = api.tutorials.create(tutorial)
      const result = api.tutorials.get(createResult.id)

      expect(result).toMatchObject({
        ...tutorial,
        project: api.projects.get(tutorial.project)
      })
      expect(result).toEqual(createResult)

      expect(() => api.tutorials.get(0)).toThrow('not found')

      try {
        api.tutorials.get(0)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toEqual(expect.stringContaining('not found'))
        expect(error.code).toEqual('NOT_FOUND')
      }
    })

    test('1.5 api.tutorials.getByUrl(url)', () => {
      const { tutorial } = fixtures.generateTutorial()

      const result = api.tutorials.create(tutorial)

      expect(
        api.tutorials.getByUrl(result.url)
      ).toEqual(
        api.tutorials.get(result.id)
      )
    })

    test('1.6 api.tutorials.getLessons(id)', () => {
      const tutorial = fixtures.createTutorial({ lessons: 4 })

      const lessonsResult = api.tutorials.getLessons(api.tutorials.get(tutorial.id))

      expect(lessonsResult).toHaveLength(4)
      expect(lessonsResult).toEqual(tutorial.lessons)
    })

    test('1.7 api.tutorials.getFolderName(id, url)', () => {
      const { tutorial } = fixtures.generateTutorial()
      const result = api.tutorials.create(tutorial)

      expect(api.tutorials.getFolderName(result.id)).toEqual(result.folderName)
      expect(result.folderName).toEqual(
        `${api.tutorials.getFormattedId(result.id)}-${tutorial.url}`
      )
      expect(api.tutorials.getFolderName(result.id)).toEqual(
        `${api.tutorials.getFormattedId(result.id)}-${tutorial.url}`
      )
      expect(api.tutorials.getFolderName(result.id, tutorial.url)).toEqual(
        `${api.tutorials.getFormattedId(result.id)}-${tutorial.url}`
      )
    })

    test('1.8 api.tutorials.getFullPath(id, url)', () => {
      const { tutorial } = fixtures.generateTutorial()
      const result = api.tutorials.create(tutorial)

      expect(result.fullPath).toEqual(
        expect.stringContaining(`${api._config.tutorialsPath}/${api.tutorials.getFolderName(result.id)}`)
      )
      expect(api.tutorials.getFullPath(result.id)).toEqual(result.fullPath)
      expect(api.tutorials.getFullPath(result.id)).toEqual(
        expect.stringContaining(`${api._config.tutorialsPath}/${api.tutorials.getFolderName(result.id)}`)
      )
      expect(api.tutorials.getFullPath(result.id, tutorial.url)).toEqual(
        expect.stringContaining(`${api._config.tutorialsPath}/${api.tutorials.getFolderName(result.id)}`)
      )
    })

    test('1.9 api.tutorials.create(data)', () => {
      const { tutorial } = fixtures.generateTutorial()
      const result = api.tutorials.create(tutorial)

      assertTutorial(result, tutorial)
    })

    test('1.10 api.tutorials.remove(id)', () => {
      const { tutorial } = fixtures.generateTutorial()
      const result = api.tutorials.create(tutorial)

      api.tutorials.remove(result.id)

      expect(() => api.tutorials.get(result.id)).toThrow('not found')
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
