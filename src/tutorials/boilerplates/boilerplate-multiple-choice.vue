<template>
  <MultipleChoiceLesson
    :text="text"
    :question="question"
    :choices="choices"
    lessonTitle="REPLACEME" />
</template>

<script>
import MultipleChoiceLesson from '../../components/Multiple-Choice-Lesson'
import text from './REPLACEME.md'

// question must be a string
const question = "What's the meaning of life, the universe, and everything?"

// choices must be an array of objects, each with the properties: `answer` (string), `correct` (boolean), and `feedback` (string)
const choices = [
  {
    answer: "Some correct answer.",
    correct: true,
    feedback: "Great job!"
  },
  {
    answer: "Some incorrect answer",
    correct: false,
    feedback: "Oops. Here's some clue about why that answer is wrong."
  },
  {
    answer: "Some incorrect answer",
    correct: false,
    feedback: "Sorry, here's some clue about why that answer is wrong."
  },
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
