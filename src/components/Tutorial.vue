<template>
  <section class="db mw7 center ph2">
    <div class="flex items-start pv4">
      <div class="project-label flex-none tc">
        <h1 class="ma0 mb2 f3 fw4">{{tutorial.project}}</h1>
        <img
          :src="tutorial.project === 'libp2p' ? libp2pLogo : ipfsLogo"
          :alt="tutorial.project"
          style="height: 54px" />
      </div>
      <div class="w-100">
        <h2 class="ma0 f3 fw5">
          <template v-if="isLanding !== true">
            <router-link :to="landingLink">{{tutorial.title}}</router-link>
          </template>
          <template v-else>
            {{tutorial.title}}
          </template>
          <span v-if="isTutorialPassed" class="ml1">🏆</span>
        </h2>
        <p class="f5 fw5 ma0 pt2 lh-copy charcoal-muted">{{tutorial.description}}</p>
        <ul class="mv4 pa0 f5" style="list-style-type: none; background: rgba(11, 58, 82, 5%)">
          <template v-for="(lesson, index) in tutorial.lessons">
            <li :key="index">
              <LessonLink
                :to="`/${tutorial.url}/${(index + 1).toString().padStart(2, 0)}`"
                :name="lesson"
                :index="index + 1" />
            </li>
          </template>
          <LessonLink v-if="tutorial.resources" :to="resourcesLink" name="More to explore" />
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import LessonLink from '../components/LessonLink.vue'
import ipfsLogo from '../static/images/ipfs.svg'
import libp2pLogo from '../static/images/libp2p.svg'

export default {
  name: 'Tutorial',
  props: {
    tutorial: Object,
    isLanding: Boolean
  },
  components: {
    LessonLink
  },
  data: self => {
    return {
      ipfsLogo: ipfsLogo,
      libp2pLogo: libp2pLogo,
      isTutorialPassed: !!localStorage[`passed/${self.tutorial.url}`]
    }
  },
  computed: {
    landingLink: function () {
      return `/${this.tutorial.url}`
    },
    resourcesLink: function () {
      return `/${this.tutorial.url}/resources`
    }
  }
}
</script>

<style scoped>
.project-label {
  display: none;
}

h2,
h2 a {
  color: black;
  text-decoration: none;
}

h2 a:focus,
h2 a:hover {
  font-weight: bold;
  text-decoration: underline;
}

@media screen and (min-width: 530px) {
  .project-label {
    display: block;
    width: 93px;
  }
}
</style>
