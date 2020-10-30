const api = require('../../../src/api')
const setup = require('../../../jest/helpers/setup')
const fixtures = require('../../../jest/helpers/fixtures')
const asserts = require('../helpers/asserts')
const runners = require('../helpers/runners')

const hardcodedData = {
  question: "What's my question?",
  choices: [
    {
      answer: 'Incorrect answer 1',
      correct: false,
      feedback: 'Feedback for incorrect answer 1'
    },
    {
      answer: 'Correct answer',
      correct: true,
      feedback: 'Positive feedback'
    },
    {
      answer: 'Incorrect answer 2',
      correct: false,
      feedback: 'Feedback for incorrect answer 2'
    }
  ]
}

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
        { question: "What's my question?", // question
          correctAnswer: 'Correct answer', // correct answer
          correctFeedback: 'Positive feedback' }, // correct feedback
        { incorrectAnswer: 'Incorrect answer 1', // incorrect answer
          incorrectFeedback: 'Feedback for incorrect answer 1' }, // incorrect feedback
        { confirm: true }, // add another incorrect answer
        { incorrectAnswer: 'Incorrect answer 2', // incorrect answer
          incorrectFeedback: 'Feedback for incorrect answer 2' }, // incorrect feedback
        { confirm: false }, // don't add another answer
        { confirm: false } // don't add another quiz
      ])

      const result = api.tutorials.getByUrl(tutorial.url)

      expect(result.lessons).toHaveLength(1)

      asserts.assertQuizUnknownOrder({ result: result.lessons[0], hardcodedData })
    })

    test('4.2 should add quiz to existing lesson', async () => {
      const tutorial = fixtures.createTutorial({
        lessons: 1,
        lessonOverride: {
          type: 'multiple-choice'
        }
      })

      await runners.protowizard([
        // add quiz just to overwrite later
        { type: 'quiz' },
        { confirm: true }, // lesson already exists
        { latestTutorial: true }, // add to latest (test) tutorial
        { lesson: tutorial.lessons[0] }, // select first (test) lesson
        { confirm: true }, // overwrite pristine quiz
        { question: 'Question to overwrite', // question
          correctAnswer: 'Correct answer to overwrite', // correct answer
          correctFeedback: 'Correct feedback to overwrite' }, // correct feedback
        { incorrectAnswer: 'Incorrect answer to overwrite', // incorrect answer
          incorrectFeedback: 'Incorrect feedback to overwrite' }, // incorrect feedback
        { confirm: false }, // don't add another answer
        // ***THE STATE OF THE JS FILE RIGHT HERE (WITH DATA MEANT TO BE OVERWRITTEN) IS WHAT JEST IS COMPARING TO WHEN IT FAILS
        { confirm: true }, // add another quiz
        // add quiz and overwrite the one above
        { confirm: true }, // lesson already exists
        { latestTutorial: true }, // add to latest (test) tutorial
        { lesson: tutorial.lessons[0] }, // select first (test) lesson
        { confirm: true }, // overwrite non-pristine quiz
        { question: "What's my question?", // question
          correctAnswer: 'Correct answer', // correct answer
          correctFeedback: 'Positive feedback' }, // correct feedback
        { incorrectAnswer: 'Incorrect answer 1', // incorrect answer
          incorrectFeedback: 'Feedback for incorrect answer 1' }, // incorrect feedback
        { confirm: true }, // add another incorrect answer
        { incorrectAnswer: 'Incorrect answer 2', // incorrect answer
          incorrectFeedback: 'Feedback for incorrect answer 2' }, // incorrect feedback
        { confirm: false }, // don't add another answer
        { confirm: false } // don't add another quiz
      ])

      const result = api.tutorials.getByUrl(tutorial.url)

      expect(result.lessons).toHaveLength(1)
      asserts.assertQuizUnknownOrder({ result: result.lessons[0], hardcodedData })
    })

    test('4.3 should cancel overwrite of non-pristine lesson', async () => {
      const tutorial = fixtures.createTutorial({
        lessons: 1,
        lessonOverride: {
          type: 'multiple-choice'
        }
      })

      // use API to create a non-pristine quiz
      api.lessons.updateQuiz(tutorial, tutorial.lessons[0], hardcodedData)

      await runners.protowizard([
        // start to make a new quiz and then cancel rather than overwrite non-pristine
        { type: 'quiz' },
        { confirm: true }, // lesson already exists
        { latestTutorial: true }, // add to latest (test) tutorial
        { lesson: tutorial.lessons[0] }, // select first (test) lesson
        { confirm: false } // cancel overwriting non-pristine quiz
      ])

      const result = api.tutorials.getByUrl(tutorial.url)

      expect(result.lessons).toHaveLength(1)

      asserts.assertQuizKnownOrder({ result })
    })

    test('4.4 should cancel overwrite of pristine lesson', async () => {
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
        { confirm: false } // cancel overwriting pristine quiz
      ])
    })
  })
})
