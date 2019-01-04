<template>
  <div>
    <Header/>
    <div class="home">
      <section class="mw7 center ph2">
        <h1 class="mt5">ProtoSchool Chapters</h1>
        <p class="f4 fw5 lh-copy ma0 pv4  ">
          Cities all over host ProtoSchool events regularly, offering you the
          opportunity to complete our interactive tutorials with the support of
          local mentors. Select a chapter below to learn more.
        </p>
        <ul>
          <li v-for="region in regions">
            <h2>{{region}}</h2>
            <ul>
              <li v-for="chapter in chaptersByRegion[region]">
                <span v-if="chapter.website">
                  <a v-bind:href="chapter.website" class="f5 link dim br-pill ph3 pv2 mb2 dib white bg-navy mr3">{{chapter.city}} - {{chapter.country}}</a>
                </span>
                <span v-else-if="chapter.repo">
                  <a v-bind:href="chapter.repo" class="f5 link dim br-pill ph3 pv2 mb2 dib white bg-navy mr3">{{chapter.city}} - {{chapter.country}}</a>
                </span>
                <span v-else>
                  <span class="f5 br-pill ph3 pv2 mb2 dib white bg-navy mr3">{{chapter.city}} - {{chapter.country}}</span>
                </span>
              </li>
            </ul>
          </li>
        </ul>
        <p class="f4 fw5 lh-copy ma0 pv4  ">
          Can't find a chapter near you? <router-link :to="'/host'">Start your own</router-link>!
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import Header from '../Header.vue'
const chapterList = require('./chapters.json')

export default {
  name: 'Tutorials',
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
ul {
  list-style-type: none;
  padding-left: 0;
}
li {
  display: inline;
}
</style>
