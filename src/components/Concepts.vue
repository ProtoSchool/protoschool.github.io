<template>
  <div class="container fr-l measure-narrow-l ph3 mb2 ml3-l ba border-green">
    <h2 class="f5 fw2 green mt0 nb1 pt3">Useful concepts</h2>
    <div class="f6 lh-copy" v-html="concepts"></div>
  </div>
</template>

<script>
export default {
  props: {
    concepts: String
  }
}
</script>

<style scoped>
.container {
  background: rgba(105, 196, 205, 10%);
}
</style>
