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
import text from './04.md'

const question = 'Which version of CIDs include the actual version number of the CID?'

const choices = [
  {
    answer: 'None. The version number is inferred by detecting whether the multicodec prefix is present.',
    correct: false,
    feedback: 'That doesn\'t sound right. Please review the previous lesson.'
  },
  {
    answer: 'All CIDs contain the version prefix, otherwise there would be no way to determine which version was used.',
    correct: false,
    feedback: 'Hmm, not always. Please review this lesson and the previous one.'
  },
  {
    answer: 'Only CIDv1 includes the version prefix, since CIDv0 didn\'t have that specification.',
    correct: true,
    feedback: 'That\'s correct!'
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
