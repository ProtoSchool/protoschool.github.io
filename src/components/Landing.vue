<template>
  <div>
    <Header />
    <Tutorial :tutorial="tutorial" isLanding :tutorialId="tutorialId"/>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Tutorial from '../components/Tutorial.vue'
import tutorialsList from '../static/tutorials.json'

export default {
  components: {
    Header,
    Tutorial
  },
  props: {
    tutorialId: String
  },
  computed: {
    tutorial: function () {
      return tutorialsList[this.tutorialId]
    }
  }
}
</script>
