<template>
  <div class="tutorials-grid flex flex-wrap justify-between">
    <template v-for="tutorial in tutorials">
      <TutorialCard class="tutorial" :tutorial="tutorial" :key="tutorial.id" />
    </template>
  </div>
</template>
<script>
import TutorialCard from './cards/TutorialCard'

export default {
  name: 'TutorialsGrid',
  components: {
    TutorialCard
  },
  props: {
    tutorials: Array
  }
}
</script>

<style scoped>
.tutorial {
  flex-basis: calc(50% - 1rem);
}

@media screen and (max-width: 630px) {
  .tutorials-grid {
    flex-wrap: nowrap;
    flex-direction: column;
  }
}
</style>
