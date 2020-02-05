<template>
  <router-link :to="to" class="link db pa3 bb b--white green hover-bg-washed-yellow">
    <div class="flex items-start justify-between">
      <div class="flex flex-row">
        <div v-if="isResources" class="tl green ttu f6" style="min-width: 93px">Resources</div>
        <div v-else class="tl green ttu f6" style="min-width: 93px">Lesson {{lessonNumber}}</div>
        <div class="pr2" style="flexShrink: 0">
          <img v-if="getLessonValue('passed' + to)" src="../static/images/complete.svg" alt="complete" style="height: 1rem;"/>
          <img v-else-if="getLessonValue('cached' + to)" src="../static/images/in-progress.svg" alt="in progress" style="height: 1rem;"/>
          <img v-else src="../static/images/not-started.svg" alt="not yet started" style="height: 0.9rem;"/>
        </div>
        <div class="navy fw5 mw6">{{lesson.title}}</div>
      </div>
      <TypeIcon
        :tutorialId="tutorialId"
        :lessonId="isResources? 'resources' : lessonId"
        class="lesson-link-icon ml3"/>
    </div>
  </router-link>
</template>

<script>

import TypeIcon from '../components/TypeIcon.vue'

export default {
  name: 'LessonLink',
  props: {
    to: String,
    lessonNumber: Number,
    lesson: Object,
    lessonId: String,
    tutorialId: [String, undefined]
  },
  components: {
    TypeIcon
  },
  computed: {
    isResources: function () {
      return this.to.split('/')[2] === 'resources'
    }
  },
  methods: {
    getLessonValue: function (lessonKey) {
      return !!localStorage[lessonKey]
    }
  }
}
</script>

<style scoped>
.lesson-link-icon {
    height: 1.3rem;
    min-width: 1.3rem;
}
</style>
