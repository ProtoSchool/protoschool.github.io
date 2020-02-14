<template>
  <section class="mw7 w-100 center ph3 flex items-start pv4">
    <div class="dn db-ns flex-none mr4">
      <h1 class="ma0 mb2 f3 fw4">{{tutorial.project}}</h1>
      <img
        :src="tutorial.project === 'libp2p' ? libp2pLogo : ipfsLogo"
        :alt="tutorial.project"
        style="height: 54px" />
    </div>
    <div class="w-100">
      <div class="flex justify-between flex-row items-start">
        <div class="flex flex-row items-center">
          <h2 class="ma0 f3 fw5">
            <template v-if="isLanding !== true">
              <router-link :to="landingLink">{{tutorial.title}}</router-link>
            </template>
            <template v-else>
              {{tutorial.title}}
            </template>
          </h2>
          <span v-if="isTutorialPassed" class="ml2 f3">🏆</span>
        </div>
        <TypeIcon
          :tutorialId="tutorialId"
          class="h2 ml3 type-icon"/>
      </div>
      <p class="f5 fw5 ma0 mt3 lh-copy charcoal-muted">{{tutorial.description}}</p>
      <ul class="lessons-list mv4 pa0 f5 br3">
        <template v-for="(lesson, index) in tutorial.lessons">
          <li :key="index">
            <LessonLink
              data-cy="lesson-link"
              :to="`/${tutorial.url}/${(index + 1).toString().padStart(2, 0)}`"
              :lesson="lesson"
              :lessonNumber="index + 1"
              :lessonId="(index + 1).toString().padStart(2, 0)"
              :tutorialId="tutorialId"/>
          </li>
        </template>
        <LessonLink data-cy="lesson-link-resources" v-if="tutorial.resources" :to="resourcesLink" :lesson="resourcesLesson" :tutorialId="tutorialId"/>
      </ul>
    </div>
  </section>
</template>

<script>
import LessonLink from '../components/LessonLink.vue'
import TypeIcon from '../components/TypeIcon.vue'
import { isTutorialPassed } from '../utils/tutorials'
import ipfsLogo from '../static/images/ipfs.svg'
import libp2pLogo from '../static/images/libp2p.svg'

const resourcesLesson = {
  'title': 'More to explore',
  'type': 'resources'
}

export default {
  name: 'Tutorial',
  props: {
    tutorial: Object,
    isLanding: Boolean,
    tutorialId: String
  },
  components: {
    LessonLink,
    TypeIcon
  },
  data: () => {
    return {
      ipfsLogo: ipfsLogo,
      libp2pLogo: libp2pLogo,
      resourcesLesson: resourcesLesson
    }
  },
  computed: {
    landingLink: function () {
      return `/${this.tutorial.url}`
    },
    resourcesLink: function () {
      return `/${this.tutorial.url}/resources`
    },
    isTutorialPassed: function () {
      return isTutorialPassed(this.tutorial)
    }
  }
}
</script>

<style scoped>
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

.lessons-list {
  list-style-type: none;
  overflow: hidden;
}

.type-icon {
  min-width: 2rem;
}

</style>
