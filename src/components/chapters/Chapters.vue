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
        <ul class="">
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
        <p class="f4 fw5 lh-copy ma0 pv4  ">
          <em>TODO: nicer, more button-y formatting for chapter listings ^</em>
        </p>
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
