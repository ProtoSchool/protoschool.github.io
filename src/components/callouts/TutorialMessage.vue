<template>
  <div
    v-if="tutorialState.type"
    class="container ph3 pt2 pb2 ba b--light-gray br3 flex-row tutorial-message flex"
    :class="'tutorial-message--' + tutorialState.type"
  >
    <InfoIcon class="mr1" />
      <div>
          <h2 class="f5 fw6 ttu mt0 nb1 p0 flex items-center content-center">{{tutorialState.title}}</h2>
          <div v-if="tutorialState.message" class="f6 lh-copy mt2 mb2 tutorial-message-text" v-html="tutorialState.message"></div>
      </div>
  </div>
</template>

<script>
import marked from 'meta-marked'
import InfoIcon from '../../static/images/icons/info.svg?inline'
import { state as tutorialState, states } from '../../utils/tutorials'

export default {
  props: {
    tutorial: Object
  },
  components: {
    InfoIcon
  },
  computed: {
    tutorialState: function () {
      let title
      let message
      const type = tutorialState.get(this.tutorial)

      function processMessage (message) {
        return marked(message).html.replace('<p>', '').replace('</p>', '')
      }

      switch (type) {
        case states.NEW: {
          title = `New`
          message = this.tutorial.newMessage && processMessage(this.tutorial.newMessage)
          break
        }
        case states.UPDATED: {
          title = `Updated`
          message = this.tutorial.updateMessage && processMessage(this.tutorial.updateMessage)
        }
      }

      return { type, message, title }
    }
  }
}
</script>
<style scoped>
.tutorial-message {
    --size: 30px;
    --padding: calc(-1 * var(--size) * 0.16);

    background-color: #fafafa;
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
.tutorial-message--new svg path {
    color: #0cb892;
}
.tutorial-message--updated svg path {
    color: #ffb700;
}
</style>
