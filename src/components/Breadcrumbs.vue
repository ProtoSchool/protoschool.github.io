<template>
  <div class="lh-title v-mid f4">
    <span class="b">{{tutorial.shortTitle}}</span> |
    <span v-if="isResources">Resources</span>
    <span v-else>Lesson {{lessonNumber}} of {{lessonsInTutorial}}</span>
    <CompleteIcon v-if="lessonPassed" class="dib ml1 v-mid h1" alt="complete" />
  </div>
</template>

<script>
import CompleteIcon from '../static/images/complete.svg?inline'

export default {
  components: {
    CompleteIcon
  },
  props: {
    isResources: Boolean,
    tutorial: Object,
    lessonNumber: Number,
    lessonsInTutorial: Number,
    lessonPassed: Boolean
  }
}
</script>

<style scoped>
img {
  height: 1.2rem;
}
</style>
