<template>
  <div>
    <Header/>
    <div class="home">
      <section class="db">
        <p class="f4 fw5 lh-copy ma0 pv4 indent-1 measure-wide">
          <strong>Chapters</strong> content here.
        </p>
        <ul>
          <li v-for="chapter in chapters">
            {{ chapter.location }}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import Header from './Header'
const chapterList = require('./chapters.json')

export default {
  name: 'Workshops',
  components: {
    Header
  },
  data: self => {
    return {
      firstWorkshopVisit: true,
      chapters: chapterList
    }
  },
  mounted: function () {
    this.checkFirstWorkshopVisit()
    console.log(chapterList)
    console.log(chapterList)
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

<style scoped>

.indent-1 {
  padding-left: 1rem;
}
.section-1 {
  display: none;
}
@media screen and (min-width: 530px) {
  .indent-1 {
    padding-left: 93px;
  }
  .section-1 {
    display: block;
    width: 93px;
  }
}

</style>
