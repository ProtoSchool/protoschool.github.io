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
import text from './05.md'

const question = 'How can we know the base encoding of a CID?'

const choices = [
  {
    answer: 'We have to guess it, but it\'s easy because most implementations of IPFS encode CIDs with "base32".',
    correct: false,
    feedback: 'That doesn\'t sound right. Please review this lesson again.'
  },
  {
    answer: 'We can check the initial characters of the hash. If it starts with "Qm", it\'s "base58btc". If it starts with "b" it\'s "base32". In both cases the CID version is "CIDv1"',
    correct: false,
    feedback: 'Hmm, not always. Please review this lesson again.'
  },
  {
    answer: 'We can check the initial characters of the hash. If it starts with "Qm", it\'s "base58btc" and is "CIDv0." If it starts with "b" it\'s "base32" and is "CIDv1."',
    correct: true,
    feedback: 'That\'s correct!'
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
