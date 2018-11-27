<template>
  <router-link :to="to" class="link db pa3 bb b--white green hover-bg-washed-yellow">
    <div class="flex">
      <div  class="w2">
        <span v-if="lessonPassed('passed' + to)">&#127942;</span>
      </div>
      <div class="green ttu f6 pr3" style="min-width: 83px">Lesson {{index}}</div>
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
