<template>
  <router-link :to="to" :class="`link db pa3 green ${isResources ? '' : 'bb b--white'}`">
    <div class="flex items-start justify-between">
      <div class="flex flex-row">
        <div v-if="isResources" class="flex-ns items-center-ns dn tl green ttu f6 fw5" style="min-width: 93px">Resources</div>
        <div v-else class="flex-ns items-center dn tl green ttu f6 fw5" style="min-width: 93px">Lesson {{lessonNumber}}</div>
        <div class="flex-ns items-center-ns pr3" style="flexShrink: 0">
          <CompleteIcon v-if="getLessonValue('passed' + to)" alt="complete" style="height: 1rem;"/>
          <InProgressIcon v-else-if="getLessonValue('cached' + to)" alt="in progress" style="height: 1rem;"/>
          <NotStartedIcon v-else alt="not yet started" style="height: 0.9rem;"/>
        </div>
        <div class="navy fw5 mw6">{{lesson.title}}</div>
      </div>
      <TypeIcon
        :tutorialId="tutorialId"
        :lessonId="isResources ? 'resources' : lessonId"
        class="link-icon ml3"
      />
    </div>
  </router-link>
</template>

<script>
import CompleteIcon from '../static/images/complete.svg?inline'
import InProgressIcon from '../static/images/in-progress.svg?inline'
import NotStartedIcon from '../static/images/not-started.svg?inline'

import TypeIcon from '../components/icons/TypeIcon.vue'

export default {
  name: 'LessonLink',
  components: {
    CompleteIcon,
    InProgressIcon,
    NotStartedIcon,
    TypeIcon
  },
  props: {
    to: String,
    lessonNumber: Number,
    lesson: Object,
    lessonId: String,
    tutorialId: [String, undefined]
  },
  computed: {
    isResources: function () {
      return this.lesson.type === 'resources'
    }
  },
  methods: {
    getLessonValue: function (lessonKey) {
      return !!localStorage[lessonKey]
    }
  }
}
</script>

<style scoped>
.link {
  background: #f2f5f6;

  transition: background 400ms;
}

.link:focus-within,
.link:hover,
.link:focus {
  background: #bfe5e9;
}

.link-icon {
    height: 1.3rem;
    min-width: 1.3rem;
}
</style>
