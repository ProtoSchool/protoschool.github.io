<template>
  <div>
    <Header/>
    <div class="home">
      <section class="db">
        <p class="f4 fw5 lh-copy ma0 pv4 indent-1 measure-wide">
          <strong>Chapters</strong> content here.
        </p>
        <ul>
          <li v-for="region in regions">
            <h3>{{region}}</h3>
            <ul>
              <li v-for="chapter in chaptersByRegion[region]">
                <span v-if="chapter.website">
                  <a v-bind:href="chapter.website">{{chapter.city}}, {{chapter.country}}</a>
                </span>
                <span v-else-if="chapter.repo">
                  <a v-bind:href="chapter.repo">{{chapter.city}}, {{chapter.country}}</a>
                </span>
                <span v-else>
                  {{chapter.city}}, {{chapter.country}}
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import Header from '../Header'
const chapterList = require('./chapters.json')

export default {
  name: 'Workshops',
  components: {
    Header
  },
  data: self => {
    return {
      chapters: chapterList
    }
  },
  computed: {
    chaptersByRegion: function () {
      const regions = []
      const chaptersByRegion = {}
      this.chapters.forEach(chapter => {
        if (!regions.includes(chapter.region)) {
          regions.push(chapter.region)
          chaptersByRegion[chapter.region] = [chapter]
        } else {
          chaptersByRegion[chapter.region].push(chapter)
        }
      })
      for (var regionName in chaptersByRegion) {
        chaptersByRegion[regionName].sort((a, b) => a.city.localeCompare(b.city))
      }
      return chaptersByRegion
    },
    regions: function () {
      const regions = []
      this.chapters.forEach(function (chapter) {
        if (!regions.includes(chapter.region)) {
          regions.push(chapter.region)
        }
      })
      return regions.sort()
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
