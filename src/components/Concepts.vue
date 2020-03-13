<template>
  <div class="container fr-l measure-narrow-l ph3 mb ml3-l ba border-green br3">
    <h2 class="f4 fw6 green mt0 mb2 pt3">Useful concepts</h2>
    <div class="f6 lh-copy" v-html="html"></div>
  </div>
</template>

<script>
import marked from 'meta-marked'

export default {
  props: {
    concepts: String
  },
  computed: {
    html: function () {
      return marked(this.concepts).html
    }
  }
}
</script>

<style scoped>
.container {
  background: rgba(105, 196, 205, 10%);
}
</style>
