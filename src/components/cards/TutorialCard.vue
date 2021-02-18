<template>
  <Card
    class="tutorial flex mb4"
    :key="tutorial.tutorialId"
    :data-tutorial-state="state && state.type"
  >
    <router-link :to="`/${tutorial.url}`" class="flex flex-column w-100 pa4 no-underline">
      <div class="flex items-center justify-between mb3">
        <div class="flex items-center">
          <ProjectIcon
            class="mr2"
            :id="tutorial.project.id"
            :alt="`${tutorial.project.name} project logo`"
            style="height: 23px"
          />
          <div class="f6 mv0 fw5 charcoal-muted">{{tutorial.project.name}}</div>
        </div>
        <span v-if="state" class="tutorial-state f7 mv0 fw7 white br3">{{state.title}}</span>
      </div>
      <div class="flex flex-row justify-between items-start navy">
        <div class="ma0 f3 fw7" data-cy="tutorial-card-title">{{tutorial.title}}</div>
        <TypeIcon
          :tutorialId="tutorial.tutorialId"
          class="h2 ml3 type-icon"
        />
      </div>
      <p class="f5 fw5 ma0 mt3 lh-copy dark-gray">{{tutorial.description}}</p>
    </router-link>
  </Card>
</template>
<script>
import Card from './SimpleCard'
import ProjectIcon from '../icons/ProjectIcon'
import TypeIcon from '../icons/TypeIcon'
import { state as tutorialState } from '../../utils/tutorials'

export default {
  name: 'TutorialCard',
  components: {
    Card,
    ProjectIcon,
    TypeIcon
  },
  props: {
    tutorial: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      state: tutorialState.get(this.tutorial)
    }
  }
}
</script>

<style scoped>
.tutorial {
  text-decoration: none;
}

.tutorial-state {
  text-transform: uppercase;
  padding: 0.3rem 0.8rem;
  line-height: 1;
}

.tutorial[data-tutorial-state="new"] .tutorial-state {
  background: var(--color-green);
}

.tutorial[data-tutorial-state="updated"] .tutorial-state {
  background: var(--color-yellow-muted);
}

.type-icon {
  min-width: 2rem;
}
</style>
