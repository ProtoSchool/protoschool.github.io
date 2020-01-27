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
import text from './04.md'

const question = 'Which version of CIDs include the actual version number of the CID?'

const choices = [
  {
    answer: 'None: the version number is implicit by detecting if the multicodec prefix is part of the CID or not.',
    correct: false,
    feedback: 'That doesn\'t sound right: please go back to the previous lesson'
  },
  {
    answer: 'All of the CIDs contain the version prefix, otherwise there would not be a way to determine which version each CID is represented as',
    correct: false,
    feedback: 'Hm, not always - please check the previous lesson and this lesson as well'
  },
  {
    answer: 'Only version 1 of CIDs include the CID version number prefix since the previous version zero did not have it',
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
