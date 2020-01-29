<template>
  <div>
    <Header :hidden="hidden"/>
    <section class="mw7 center ph2">
      <h1 class="mt5">ProtoSchool Chapters</h1>
        <p class="f4 fw5 lh-copy ma0 pv3  ">
        We recently switched from a chapter-based community model to an event-based model to
        create a more scalable system that encourages ProtoSchool content to be presented
         either one-off or embedded in a variety of exiting educational groups,
         with a lower barrier to entry for event leaders. If you previously attended
         events through a ProtoSchool chapter, you'll now find their upcoming
         ProtoSchool workshops listed on our <router-link to="/events">events page</router-link>,
          including links to learn about other content the group might offer.
      </p>

      <router-link to="/events" class="f5 link dim br-pill ph3 pv2 mb4 dib white bg-navy mr3">View all upcoming ProtoSchool events!</router-link>

      <h2>Archived Chapter Listings</h2>

      <ul>
        <li v-for="(region, idx) in regions" :key="`region-${idx}`">
          <h3>{{region}}</h3>
          <ul>
            <li v-for="(chapter, idx) in chaptersByRegion[region]" :key="`chapter-${idx}`">
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
    </section>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import chapterList from '../static/chapters.json'

export default {
  name: 'Tutorials',
  components: {
    Header
  },
  props: {
    hidden: Boolean
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
