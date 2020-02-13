<template>
  <MultipleChoiceLesson
    :text="text"
    :question="question"
    :choices="choices"
    :lessonId="lessonId"
    :tutorialId="tutorialId"
  />
</template>

<script>
import MultipleChoiceLesson from '../../components/MultipleChoiceLesson'
import text from './01.md'

const question = 'What is the default cryptographic algorithm used by IPFS to generate CIDs?'

const choices = [
  {
    answer: '`sha1`',
    correct: false,
    feedback: 'Try again'
  },
  {
    answer: '`sha2-256`',
    correct: true,
    feedback: 'That\'s correct!'
  },
  {
    answer: 'It uses a combination of `sha1`, `sha2-256`, `sha3-256`, `sha3-512` and `shake-256`.',
    correct: false,
    feedback: 'IPFS only uses one algorithm to generate a CID.'
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
