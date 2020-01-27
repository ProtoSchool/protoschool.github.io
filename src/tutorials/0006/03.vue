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
import text from './03.md'

const question = 'How can we identify the encoding used on specific data when using CIDs?'

const choices = [
  {
    answer: 'CIDs have a multicodec prefix that specifies in which encoding is the data represented',
    correct: true,
    feedback: 'That\'s right!'
  },
  {
    answer: 'All encodings make it safe to try and check the first bytes of the data to figure out which encoding was used',
    correct: false,
    feedback: 'Hm, not always - please check the information above'
  },
  {
    answer: 'We can\'t know for sure but the multicodec prefix included in the CID is a hint that is not always guaranteed to be right',
    correct: false,
    feedback: 'Are you sure it\'s just a hint?'
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
