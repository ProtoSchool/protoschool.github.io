<template>
  <div class="container ph3 pt2 pb2 ba b--light-gray br3 flex-row tutorial-message flex">
    <InfoIcon class="mr1" />
    <div>
      <h2 class="f5 fw6 ttu mt0 nb1 p0 flex items-center content-center">Coding Challenges Ahead</h2>
      <div class="f6 lh-copy mt2 mb2 tutorial-message-text">
        <span>This tutorial includes coding challenges! You'll need some familiarity with JavaScript and a high resolution device with a keyboard to complete them.</span>
      </div>
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

.tutorial-message svg path {
    color: var(--color-yellow-muted);
}
</style>
