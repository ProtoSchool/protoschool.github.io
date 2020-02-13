<template>
    <Lesson
    :lessonId="lessonId"
    :tutorialId="tutorialId"
    :text="text" />
</template>

<script>
import Lesson from '../../components/Lesson'
import text from './01.md'

export default {
  components: {
    Lesson
  },
  data: self => {
    return {
      lessonId: self.$attrs.lessonId,
      tutorialId: self.$attrs.tutorialId,
      text
    }
  }
}
</script>
