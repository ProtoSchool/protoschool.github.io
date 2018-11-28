<template>
  <router-link :to="to" class="link db pa3 bb b--white green hover-bg-washed-yellow">
    <div class="flex">
      <div class="green ttu f6" style="min-width: 72px">Lesson {{index}}</div>
      <div class="pr2">
        <img v-if="lessonPassed('passed' + to)" src="./complete.svg" alt="complete" style="height: 1rem;"/>
        <img v-else src="./not-started.svg" alt="not yet started" style="height: 1rem;"/>
      </div>
      <div class="navy fw5 mw6">{{name}}</div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'ExerciseLink',
  props: [
    'to',
    'index',
    'name'
  ],
  methods:  {
    lessonPassed: function(lessonKey) {
      console.log(`localStorage[${lessonKey}] is: `, localStorage[lessonKey])
      return !!localStorage[lessonKey]
    }
  },
}
</script>
