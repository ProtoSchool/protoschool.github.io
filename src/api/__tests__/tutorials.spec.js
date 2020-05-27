const setup = require('../../../jest/helpers/setup')
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
    test.todo('1.1 api.tutorials.getNextTutorialId()')

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

    test.todo('1.4 api.tutorials.get(id)')
    test.todo('1.5 api.tutorials.getByUrl(url)')
    test.todo('1.6 api.tutorials.getLessons(id)')
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
