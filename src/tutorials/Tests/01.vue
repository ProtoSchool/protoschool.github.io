<template>
  <MultipleChoiceLesson
    :text="text"
    :question="question"
    :choices="choices"
    lessonTitle="The meaning of life, the universe, and everything" />
</template>

 <script>
import MultipleChoiceLesson from '../../components/MultipleChoiceLesson'
import text from './01.md'
 // question must be a string
const question = "What's the meaning of life, the universe, and everything?"
 // choices must be an array of objects, each with the properties: `answer` (string), `correct` (boolean), and `feedback` (string)
const choices = [
  {
    answer: 'Doing good',
    correct: false,
    feedback: 'Sorry, we were `looking` for a _numerical_ *value*. Think Douglas Adams.'
  },
  {
    answer: '42',
    correct: true,
    feedback: 'Great job!'
  },
  {
    answer: '24',
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
