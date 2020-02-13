<template>
  <div class="lh-title v-mid f4">
    <span class="b">{{tutorial.shortTitle}}</span> |
    <span v-if="isResources">Resources</span>
    <span v-else>Lesson {{lessonNumber}} of {{lessonsInTutorial}}</span>
    <img v-if="lessonPassed" src="../static/images/complete.svg" class="dib ml1 v-mid" alt="complete" />
  </div>
</template>

<script>
export default {
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
