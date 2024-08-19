import { restoreData } from '../../../jest/helpers/setup'
import { generateLesson } from '../../../jest/helpers/fixtures'
import { tutorials, lessons } from '../../api'
import { assertLesson, assertUpdatedQuiz } from './helpers/asserts'

describe('api', () => {
  let lastTutorialId

  beforeAll(() => {
    lastTutorialId = (tutorials.list.getLatest()).id
  })

  afterEach(() => {
    restoreData(lastTutorialId)
  })

  describe('2 api.lessons', () => {
    describe('2.1 api.lessons.create(tutorial, data)', () => {
      test('2.1.1 create text lesson', () => {
        const { lesson, tutorial } = generateLesson({ createTutorial: true })
        const result = lessons.create(tutorial, lesson)

        expect(tutorials.get(tutorial.id).lessons).toHaveLength(1)
        assertLesson(result, lesson)
      })

      test('2.1.2 create multiple-choice lesson', () => {
        const { lesson, tutorial } = generateLesson({
          override: { type: 'multiple-choice' },
          createTutorial: true
        })
        const result = lessons.create(tutorial, lesson)

        expect(tutorials.get(tutorial.id).lessons).toHaveLength(1)
        assertLesson(result, lesson)
      })

      test('2.1.3 create code lesson', () => {
        const { lesson, tutorial } = generateLesson({
          override: { type: 'code' },
          createTutorial: true
        })
        const result = lessons.create(tutorial, lesson)

        expect(tutorials.get(tutorial.id).lessons).toHaveLength(1)
        assertLesson(result, lesson)
      })

      test('2.1.4 create file-upload lesson', () => {
        const { lesson, tutorial } = generateLesson({
          override: { type: 'file-upload' },
          createTutorial: true
        })
        const result = lessons.create(tutorial, lesson)

        expect(tutorials.get(tutorial.id).lessons).toHaveLength(1)
        assertLesson(result, lesson)
      })
    })
    describe('2.2 api.lessons.updateQuiz(tutorial, data)', () => {
      test('2.2.1 should update quiz', () => {
        const { lesson, tutorial } = generateLesson({
          override: { type: 'multiple-choice' },
          createTutorial: true
        })
        const result = lessons.create(tutorial, lesson)

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
        lessons.updateQuiz(tutorial, result, hardcodedData)
        assertUpdatedQuiz(result)
      })
    })
  })
})
