<template>
  <div class="tutorials-grid flex flex-wrap justify-between">
    <template v-for="tutorial in tutorials">
      <Card class="tutorial flex mb4" :key="tutorial.tutorialId" >
        <router-link :to="tutorial.url" class="flex flex-column pa4 no-underline">
          <div class="flex flex-row justify-between items-start navy">
            <h3 class="ma0 f3 fw7">{{tutorial.title}}</h3>
            <TypeIcon
              :tutorialId="tutorial.tutorialId"
              class="h2 ml3 type-icon"
            />
          </div>
          <p class="f5 fw5 ma0 mt3 lh-copy dark-gray">{{tutorial.description}}</p>
        </router-link>
      </Card>
    </template>
  </div>
</template>
<script>
import Card from '../components/Card'
import TypeIcon from '../components/TypeIcon'

export default {
  name: 'TutorialsGrid',
  components: {
    Card,
    TypeIcon
  },
  props: {
    tutorials: Array
  }
}
</script>

<style scoped>
.tutorial {
  flex-basis: calc(50% - 1rem);
  text-decoration: none;
}

.type-icon {
  min-width: 2rem;
}

@media screen and (max-width: 630px) {
  .tutorials-grid {
    flex-wrap: nowrap;
    flex-direction: column;
  }
}
</style>
