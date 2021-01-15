<template>
  <section class="mw7 w-100 center ph3 flex items-start pv3 mt3">
    <ProjectIcon
      class="dn db-ns mr3"
      :id="tutorial.project.id"
      :alt="`${tutorial.project.name} project logo`"
      style="height: 53px"
    />
    <div class="w-100">
      <div class="flex items-center">
        <ProjectIcon
          class="dn-ns mr1 mb1"
          :id="tutorial.project.id"
          :alt="`${tutorial.project.name} project logo`"
          style="height: 23px"
        />
        <h2 class="f6 mv0 fw2">{{tutorial.project.name}}</h2>
      </div>
      <div class="flex justify-between flex-row items-start mb1">
        <div class="flex flex-row items-start mt1">
          <h1 class="ma0 f3 fw5">
            <template v-if="isLanding !== true">
              <router-link :to="landingLink" data-cy="tutorial-title">{{tutorial.title}}</router-link>
            </template>
            <template v-else>
              {{tutorial.title}}
            </template>
          </h1>
          <span v-if="isTutorialPassed(tutorial)" class="ml2 f3">🏆</span>
        </div>
        <TypeIcon
          :tutorialId="tutorialId"
          class="h2 ml3 type-icon"/>
      </div>

      <p class="f5 fw5 mt2 mb3 lh-copy charcoal-muted" v-html="description"></p>
      <TutorialMessage :tutorial="tutorial" class="mb4" />
      <ul class="lessons-list mv2 pa0 f5 br3">
        <template v-for="(lesson, index) in tutorial.lessons">
          <li :key="index">
            <LessonLink
              data-cy="lesson-link-standard"
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
import marked from 'meta-marked'

import LessonLink from '../components/LessonLink.vue'
import TypeIcon from '../components/TypeIcon.vue'
import ProjectIcon from '../components/icons/ProjectIcon.vue'
import TutorialMessage from '../components/callouts/TutorialMessage.vue'
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
    TypeIcon,
    ProjectIcon,
    TutorialMessage
  },
  data: self => {
    return {
      resourcesLesson,
      isTutorialPassed
    }
  },
  computed: {
    description: function () {
      return marked(this.tutorial.description).html
    },
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
