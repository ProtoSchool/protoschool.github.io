<template>
    <div>
        <MultipleChoiceLesson
        :text="text"
        :question="question"
        :choices="choices" />
    </div>
</template>

<script>
import MultipleChoiceLesson from '../../components/MultipleChoiceLesson'
import text from './02.md'

const question = 'How do CIDs support multiple cryptographic algorithms?'

const choices = [
  {
    answer: 'The length of the hash tells us which cryptographic algorithm was used. If the length is "256" then the algorithm used was "sha2-256". If the length is "512" then the algorithm used was "sha2-512."',
    correct: false,
    feedback: "It's true that the length of a `sha-256` hash is 256, but this isn't enough information to tell us what hashing algorithm was used. Check the information above and try again."
  },
  {
    answer: 'By prefixing the hash with a unique identifier that flags which algorithm was used to generate the hash.',
    correct: false,
    feedback: 'You\'re almost there! There\'s something else that the hash gets prefixed with.'
  },
  {
    answer: `By prefixing the hash with a unique identifier that flags both the algorithm used to generate the hash and the length of the hash value.`,
    correct: true,
    feedback: 'That\'s right!'
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
