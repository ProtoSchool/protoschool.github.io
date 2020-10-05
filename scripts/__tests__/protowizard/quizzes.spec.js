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
      // TODO: create a result.lessons.choices array that can be referenced elsewhere
      // would then be able to test by checking that each answer is present (in any order)
      // OR sorting and then comparing directly

      // TODO: Add assertions - HAS 1 NEW QUIZ WITH GIVEN QUESTIONS
      // asserts.assertNewQuiz({
      //   context: { lastTutorialId },
      //   expected,
      //   result
      // })
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
        { confirm: true }, // add another quiz
        // add quiz and overwrite the one above
        { confirm: true }, // lesson already exists
        { latestTutorial: true }, // add to latest (test) tutorial
        { lesson: tutorial.lessons[0] }, // select first (test) lesson
        { confirm: true }, // overwrite non-pristine quiz
        { question: 'Is this my question?', // question
          correctAnswer: 'Right answer', // correct answer
          correctFeedback: 'That is soooo right!' }, // correct feedback
        { incorrectAnswer: 'first wrong answer', // incorrect answer
          incorrectFeedback: 'Try again.' }, // incorrect feedback
        { confirm: true }, // add another incorrect answer
        { incorrectAnswer: 'second wrong answer', // incorrect answer
          incorrectFeedback: 'Nope!' }, // incorrect feedback
        { confirm: false }, // don't add another answer
        { confirm: false } // don't add another quiz
      ])

      const result = api.tutorials.getByUrl(tutorial.url)

      expect(result.lessons).toHaveLength(1)
      console.log(result.lessons[0])
      // TODO: create a result.lessons.choices array that can be referenced elsewhere
      // would then be able to test by checking that each answer is present (in any order)
      // OR sorting and then comparing directly

      // TODO: Add assertions - HAS 1 NEW QUIZ WITH GIVEN QUESTIONS
      // asserts.assertNewQuiz({
      //   context: { lastTutorialId },
      //   expected,
      //   result
      // })
    })

    test('4.3 should cancel overwrite of non-pristine lesson', async () => {
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
          incorrectFeedback: 'Nope!' }, // incorrect feedback
        { confirm: false }, // don't add another answer
        { confirm: true }, //  add another quiz
        // start to make a new quiz and then cancel rather than overwrite
        { confirm: true }, // lesson already exists
        { latestTutorial: true }, // add to latest (test) tutorial
        { lesson: tutorial.lessons[0] }, // select first (test) lesson
        { confirm: false } // cancel overwriting non-pristine quiz
      ])

      const result = api.tutorials.getByUrl(tutorial.url)

      expect(result.lessons).toHaveLength(1)
      console.log(result.lessons[0])
      // TODO: create a result.lessons.choices array that can be referenced elsewhere
      // would then be able to test by checking that each answer is present (in any order)
      // OR sorting and then comparing directly

      // TODO: Add assertions - HAS 1 NEW QUIZ WITH GIVEN QUESTIONS
      // asserts.assertNewQuiz({
      //   context: { lastTutorialId },
      //   expected,
      //   result
      // })
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

      const result = api.tutorials.getByUrl(tutorial.url)

      expect(result.lessons).toHaveLength(1)
      console.log(result.lessons[0])
      // TODO: create a result.lessons.choices array that can be referenced elsewhere
      // would then be able to test by checking that each answer is present (in any order)
      // OR sorting and then comparing directly

      // TODO: Add assertions - SHOULD HAVE 1 NEW LESSON MATCHING #PRISTINE# BOILERPLATE
      // asserts.assertPristineQuiz({
      //   context: { lastTutorialId },
      //   expected,
      //   result
      // })
    })
  })
})
