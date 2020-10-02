const api = require('../../../src/api')
const setup = require('../../../jest/helpers/setup')
const fixtures = require('../../../jest/helpers/fixtures')
const asserts = require('../helpers/asserts')
const runners = require('../helpers/runners')

describe('protowizard', () => {
  let lastTutorialId

  beforeAll(() => {
    lastTutorialId = api.tutorials.list.getLatest().id
  })

  afterEach(() => {
    setup.restoreData(lastTutorialId)
  })

  describe('4. create quiz', () => {
    test('4.1 should add quiz to pristine lesson', async () => {
      const tutorial = fixtures.createTutorial({
        lessons: 1,
        lessonOverride: {
          type: 'multiple-choice'
        }
      })

      await runners.protowizard([
        { type: 'quiz' },
        { confirm: true }, // lesson already exists
        { latestTutorial: true }, // add to latest (test) tutorial
        { lesson: tutorial.lessons[0] }, // select first (test) lesson
        { confirm: true }, // overwrite pristine quiz
        { question: 'Is this my question?', // question
          correctAnswer: 'Right answer', // correct answer
          correctFeedback: 'That is soooo right!' }, // correct feedback
        { incorrectAnswer: 'first wrong answer', // incorrect answer
          incorrectFeedback: 'Try again.' }, // incorrect feedback
        { confirm: true }, // add another incorrect answer
        { incorrectAnswer: 'second wrong answer', // incorrect answer
          incorrectFeedback: 'Nope!' }, // incorrect feedba
        { confirm: false }, // don't add another answer
        { confirm: false } // don't add another quiz
      ])

      const result = api.tutorials.getByUrl(tutorial.url)

      expect(result.lessons).toHaveLength(1)
      console.log(result.lessons[0])
      // asserts.assertNewTutorial({
      //   context: { lastTutorialId },
      //   expected,
      //   result
      // })
    })
    test.todo('4.2 should add quiz to existing lesson')
    test.todo('4.3 should cancel overwrite of non-pristine lesson')
    test.todo('4.4 should cancel overwrite of pristine lesson')
  })
})
