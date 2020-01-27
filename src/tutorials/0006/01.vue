<template>
  <MultipleChoiceLesson
    :text="text"
    :question="question"
    :choices="choices" />
</template>

<script>
import MultipleChoiceLesson from '../../components/MultipleChoiceLesson'
import text from './01.md'

const question = 'By default, what is the cryptographic algorithm used by IPFS to generate CIDs?'

const choices = [
  {
    answer: 'sha1',
    correct: false,
    feedback: 'Try again'
  },
  {
    answer: 'sha2-256',
    correct: true,
    feedback: 'That\'s correct!'
  },
  {
    answer: 'It uses a combination of sha1, sha2-256, sha3-256, sha3-512 and shake-256',
    correct: false,
    feedback: 'IPFS only uses one algorithm to generate a CID.'
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
