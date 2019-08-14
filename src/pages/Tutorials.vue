<template>
  <div>
    <Header/>
    <div class="home">
      <section class="db">
        <h1 class="mw7 center ph2 mt5">Interactive Tutorials</h1>
        <p class="f4 fw5 lh-copy ma0 pv4 mw7 center ph2">
          Our interactive tutorials help you learn about the
          decentralized web by writing code and solving challenges.
        </p>
      </section>
      <template v-for="(tutorial, index) in allTutorials">
        <Tutorial :tutorial="tutorial" :key="index" />
      </template>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Tutorial from '../components/Tutorial.vue'
import coursesList from '../static/courses.json'
import tutorialsList from '../static/tutorials.json'

export default {
  name: 'Tutorials',
  components: {
    Header,
    Tutorial
  },
  computed: {
    allTutorials: () => coursesList.all.map((e) => tutorialsList[e])
  },
  data: self => {
    return {
      firstWorkshopVisit: true,
      tutorialsList
    }
  },
  mounted: function () {
    this.checkFirstWorkshopVisit()
  },
  methods: {
    checkFirstWorkshopVisit: function () {
      for (let key of Object.keys(localStorage)) {
        if (key.startsWith('passed') || key.startsWith('cached')) {
          // TRACK? return visit
          this.firstWorkshopVisit = false
          return
        }
      }
      // TRACK? first site visit
      this.firstWorkshopVisit = true
    }
  }
}
</script>
