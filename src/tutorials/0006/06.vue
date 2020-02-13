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
import text from './06.md'

const question = 'If we have two different CIDs pointing to the same content, doesn\'t that break the "uniqueness" rule specified in the first lesson?'

const choices = [
  {
    answer: 'Yes, because v0 and v1 of the CID specs are not compatible.',
    correct: false,
    feedback: 'That doesn\'t sound right. Please review the lesson content.'
  },
  {
    answer: 'No, because the two CIDs are just two different version representations of the same hash.',
    correct: true,
    feedback: 'That\'s correct!'
  },
  {
    answer: 'Yes, because the hashes are no longer unique.',
    correct: false,
    feedback: 'Hmm, that\'s not it. Please review the lesson again.'
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
