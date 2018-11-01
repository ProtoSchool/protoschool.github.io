<template>
  <router-link :to="to" class="link db pa3 bb b--white green hover-bg-washed-yellow">
    <span class="green ttu f6 pr3">Lesson {{index}}</span>
    <span class="navy fw5">{{name}}</span>
  </router-link>
</template>

<script>
export default {
  name: 'ExerciseLink',
  props: [
    'to',
    'index',
    'name'
  ]
}
</script>
