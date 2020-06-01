const setup = require('../../../jest/helpers/setup')
const fixtures = require('../../../jest/helpers/fixtures')
const api = require('../')
const { assertTutorial } = require('./helpers/asserts')

describe('api', () => {
  let lastTutorialId

  beforeAll(async () => {
    lastTutorialId = (await api.tutorials.list.getLatest()).id
  })

  afterAll(async () => {
    await setup.restoreData(lastTutorialId)
  })

  describe('1 api.tutorials', () => {
    test('1.1 api.tutorials.getNextTutorialId()', async () => {
      expect(await api.tutorials.getNextTutorialId()).toEqual(lastTutorialId + 1)
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

    test('1.4 api.tutorials.get(id)', async () => {
      const { tutorial } = await fixtures.generateTutorial()
      const createResult = await api.tutorials.create(tutorial)
      const result = await api.tutorials.get(createResult.id)

      expect(result).toMatchObject({
        ...tutorial,
        project: await api.projects.get(tutorial.project)
      })
      expect(result).toEqual(createResult)

      await expect(api.tutorials.get(0)).rejects.toThrow('not found')
    })

    test('1.5 api.tutorials.getByUrl(url)', async () => {
      const { tutorial } = await fixtures.generateTutorial()

      const result = await api.tutorials.create(tutorial)

      expect(
        await api.tutorials.getByUrl(result.url)
      ).toEqual(
        await api.tutorials.get(result.id)
      )
    })

    test('1.6 api.tutorials.getLessons(id)', async () => {
      const { tutorial, lessons } = await fixtures.generateTutorial({ lessons: 4 })
      const result = await api.tutorials.create(tutorial)
      const expectedLessons = []

      expectedLessons.push(await api.lessons.create(await api.tutorials.get(result.id), lessons[0]))
      expectedLessons.push(await api.lessons.create(await api.tutorials.get(result.id), lessons[1]))
      expectedLessons.push(await api.lessons.create(await api.tutorials.get(result.id), lessons[2]))
      expectedLessons.push(await api.lessons.create(await api.tutorials.get(result.id), lessons[3]))

      const lessonsResult = await api.tutorials.getLessons(await api.tutorials.get(result.id))

      expect(lessonsResult).toHaveLength(4)
      expect(lessonsResult).toEqual(expectedLessons)
    })

    test.todo('1.7 api.tutorials.getFolderName(id)')
    test.todo('1.8 api.tutorials.getFolderName(id, url)')
    test.todo('1.9 api.tutorials.getFullPath(id)')
    test.todo('1.10 api.tutorials.getFullPath(id, url)')

    test('1.11 api.tutorials.create(data)', async () => {
      const tutorialDetails = {
        title: 'New Tutorial',
        url: `new-tut-${Math.random()}`,
        project: 'libp2p',
        description: 'New tutorial description'
      }

      const result = await api.tutorials.create(tutorialDetails)

      await assertTutorial(result, tutorialDetails)
    })

    test.todo('1.12 api.tutorials.remove(id)')

    describe('1.13 api.tutorials.list', () => {
      test.todo('1.13.1 api.tutorials.list.getStaticPath()')
      test.todo('1.13.2 api.tutorials.list.getJson()')
      test.todo('1.13.3 api.tutorials.list.get()')
      test.todo('1.13.4 api.tutorials.list.getLatest()')
      test.todo('1.13.5 api.tutorials.list.add(data)')
    })
  })
})
