<template>
  <div class="lh-solid v-mid f4 green">
    <span class="b">{{workshopShortname}}</span> |
    <span v-if="isResources">Resources</span>
    <span v-else>Lesson {{lessonNumber}} of {{lessonsInWorkshop}}</span>
    <img v-if="lessonPassed" src="../static/images/complete.svg" class="dib ml1 v-mid" alt="complete" />
  </div>
</template>

<script>
export default {
  props: {
    isResources: Boolean,
    workshopShortname: String,
    lessonNumber: Number,
    lessonsInWorkshop: Number,
    lessonPassed: Boolean
  }
}
</script>

<style scoped>
img {
  height: 1.2rem;
}
</style>
