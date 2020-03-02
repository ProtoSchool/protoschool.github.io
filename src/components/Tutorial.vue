<template>
  <section class="mw7 w-100 center ph3 flex items-start pv4">
    <img
      class="dn db-ns mr3"
      :src="tutorial.project.logo"
      :alt="tutorial.project.name"
      style="height: 53px"
    />
    <div class="w-100">
      <div class="flex justify-between flex-row items-start mb1">
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
      <div class="flex items-center">
        <img
          class="dn-ns"
          :src="tutorial.project.logo"
          :alt="tutorial.project.name"
          style="height: 23px"
        />
        <h1 class="ml1 mt0 mb0 f6 fw2">{{tutorial.project.name}}</h1>
      </div>
      <p class="f5 fw5 ma0 mt4 lh-copy charcoal-muted">{{tutorial.description}}</p>
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
