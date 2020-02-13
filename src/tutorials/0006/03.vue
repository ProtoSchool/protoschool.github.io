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
import text from './03.md'

const question = 'How can we identify the encoding used on specific data when using CIDv1?'

const choices = [
  {
    answer: 'These CIDs have a multicodec prefix that specifies which encoding method was used.',
    correct: true,
    feedback: 'That\'s right!'
  },
  {
    answer: 'All encodings make it safe to try and check the first bytes of the data to figure out which encoding was used',
    correct: false,
    feedback: 'Hmm, not always. Please check the information above'
  },
  {
    answer: 'We can\'t know for sure, but the multicodec prefix included in the CID is a hint that is not always guaranteed to be right.',
    correct: false,
    feedback: 'Are you sure it\'s just a hint?'
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
