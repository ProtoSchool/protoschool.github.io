<template>
  <router-link :to="to" class="link db pa3 bb b--white green hover-bg-washed-yellow">
    <div class="flex items-center">
      <div v-if="isResources" class="tc green ttu f6" style="min-width: 93px">Resources</div>
      <div v-else class="tc green ttu f6" style="min-width: 93px">Lesson {{index}}</div>
      <div class="pr2 flex">
        <img v-if="lessonPassed('passed' + to)" src="../static/images/complete.svg" alt="complete" style="height: 1rem;"/>
        <img v-else-if="lessonCached('cached' + to)" src="../static/images/in-progress.svg" alt="in progress" style="height: 1rem;"/>
        <img v-else src="../static/images/not-started.svg" alt="not yet started" style="height: 0.9rem;"/>
      </div>
      <div class="navy fw5 mw6">{{name}}</div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'LessonLink',
  props: [
    'to',
    'index',
    'name'
  ],
  computed: {
    isResources: function () {
      return this.to.split("/")[2] === 'resources'
    }
  },
  methods: {
    lessonPassed: function (lessonKey) {
      return !!localStorage[lessonKey]
    },
    lessonCached: function (cacheKey) {
      return !!localStorage[cacheKey]
    }
  }
}
</script>
