<template>
  <div
    v-if="tutorialState && tutorialState.type"
    class="container ph3 pt2 pb2 ba b--light-gray br3 flex-row tutorial-message flex"
    :data-tutorial-state="tutorialState.type"
  >
    <InfoIcon class="mr1" />
    <div>
      <h2 class="f5 fw6 ttu mt0 nb1 p0 flex items-center content-center">{{tutorialState.title}}</h2>
      <div v-if="tutorialState.message" class="f6 lh-copy mt2 mb2 tutorial-message-text" v-html="tutorialState.message" />
    </div>
  </div>
</template>

<script>
import InfoIcon from '../../static/images/icons/info.svg?inline'
import { state as tutorialState } from '../../utils/tutorials'

export default {
  props: {
    tutorial: Object
  },
  components: {
    InfoIcon
  },
  computed: {
    tutorialState: function () {
      return tutorialState.get(this.tutorial)
    }
  }
}
</script>
<style scoped>
.tutorial-message {
    --size: 30px;
    --padding: calc(-1 * var(--size) * 0.16);

    background-color: var(--color-snow-muted);
}

.tutorial-message h2 {
    height: var(--size);
    transform: translateY(1px);
}

.tutorial-message svg {
    height: var(--size);
    min-width: var(--size);

    margin-left: var(--padding);
}
.tutorial-message[data-tutorial-state="new"] svg path {
    color: var(--color-green);
}
.tutorial-message[data-tutorial-state="updated"] svg path {
    color: var(--color-yellow-muted);
}
</style>
