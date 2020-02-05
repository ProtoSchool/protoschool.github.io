<template>
  <MultipleChoiceLesson
    :lessonId="lessonId"
    :tutorialId="tutorialId"
    :text="text"
    :question="question"
    :choices="choices" />
</template>

<script>
import MultipleChoiceLesson from '../../components/Multiple-Choice-Lesson'
import text from './REPLACEME.md'

// Question must be a string
const question = "What's the meaning of life, the universe, and everything?"

// Choices must be an array of objects, each with the properties:
// `answer` (string), `correct` (boolean), and `feedback` (string)
// Only one answer can be correct.
const choices = [
  {
    answer: 'Some correct answer.',
    correct: true,
    feedback: 'Great job!'
  },
  {
    answer: 'Some incorrect answer',
    correct: false,
    feedback: 'Oops. Here\'s some clue about why that answer is wrong.'
  },
  {
    answer: 'Some incorrect answer',
    correct: false,
    feedback: 'Sorry, here\'s some clue about why that answer is wrong.'
  }
]

export default {
  components: {
    MultipleChoiceLesson
  },
  data: self => {
    return {
      lessonId: self.$attrs.lessonId,
      tutorialId: self.$attrs.tutorialId,
      text,
      question,
      choices
    }
  }
}
</script>
