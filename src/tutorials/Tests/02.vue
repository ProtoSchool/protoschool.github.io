<template>
  <MultipleChoiceLesson
    :text="text"
    :question="question"
    :choices="choices"
    lessonTitle="Sample Multiple Choice Lesson" />
</template>

 <script>
import MultipleChoiceLesson from '../../components/MultipleChoiceLesson'
import text from './01.md'
 // question must be a string
const question = 'just a random question'
 // choices must be an array of objects, each with the properties: `answer` (string), `correct` (boolean), and `feedback` (string)
const choices = [
  {
    answer: '9191',
    correct: true,
    feedback: 'Great job!'
  },
  {
    answer: 'dogin bad',
    correct: false,
    feedback: 'Sorry, we were `looking` for a _numerical_ *value*. Think Douglas Adams.'
  },
  {
    answer: 'fasdfasdf',
    correct: false,
    feedback: 'Oops. Looks like you reversed those digits. Try again!'
  }
]
 export default {
  components: {
    MultipleChoiceLesson
  },
  data: () => {
    return { text, question, choices }
  }
}
</script>
