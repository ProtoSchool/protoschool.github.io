<template>
  <div>
    <Header/>
    <section class="center ph3 mw7">
      <h1 class="mt4">Interactive Tutorials</h1>
      <p class="f4 fw5 lh-copy ma0 pb4">
        Our self-guided interactive tutorials are designed to introduce you to decentralized web concepts, protocols, and tools. Select your topic and track your progress as you go, in a format that's right for you. Complete JavaScript code challenges right in your web browser or stick to our text-based or multiple-choice tutorials for a code-free experience. Our handy little icons will guide you to the content that fits your needs.</p>
      <div class="mw7 center w100 tr">
        <label for="course-select">Course</label>
        <select name="course" id="course-select" v-model="courseFilter">
          <option v-for="(course, courseName) in courses" :value="courseName">{{course.name}} ({{course.tutorialCount}})</option>
        </select>
        <ToggleButton
            :value="showCodingTutorials"
            sync
            color="#69c4cd"
            :width="40"
            :name="'includeCodingTutorials'"
            :id="'includeCodingTutorials'"
            :label="'Include Coding Tutorials'"
            class="mb3"
            data-cy="toggle-coding-tutorials"
            :onClick="processToggle"
        />
      </div>
    </section>

    <template v-for="tutorial in (showCodingTutorials? filteredTutorials : codelessTutorials)" >
      <Tutorial :tutorial="tutorial" :key="tutorial.tutorialId" :tutorialId="tutorial.tutorialId" />
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import coursesList from '../static/courses.json'
import tutorials, { getTutorialType, correctedCases } from '../utils/tutorials'
import settings from '../utils/settings'

import Header from '../components/Header.vue'
import Tutorial from '../components/Tutorial.vue'
import ToggleButton from '../components/ToggleButton.vue' // adapted locally from npm package 'vue-js-toggle-button'
import { EVENTS } from '../static/countly'

export default {
  name: 'Tutorials',
  components: {
    Header,
    Tutorial,
    ToggleButton
  },
  computed: {
    courses: function () {
      console.log(correctedCases)
      let courses = {}
      let standardCourses = _.omit(coursesList, ['featured'])
      for (const course in standardCourses) {
        courses[course] = {
          name: correctedCases[course] || _.capitalize(course),
          tutorialCount: coursesList[course].length
        }
      }
      return courses
    },
    filteredTutorials: function () {
      return coursesList[this.courseFilter].map(tutorialId => ({ ...tutorials[tutorialId], tutorialId }))
    },
    codelessTutorials: function () {
      return this.filteredTutorials.filter(tutorial => {
        const tutorialType = getTutorialType(tutorial.tutorialId)

        return tutorialType !== 'code' && tutorialType !== 'file-upload'
      })
    }
  },
  data: self => {
    let showCodingTutorials = self.$route.query.code || settings.filters.get(settings.filters.TUTORIALS.SHOW_CODING)

    if (self.$route.query.code) {
      showCodingTutorials = showCodingTutorials ? showCodingTutorials === 'true' : true
      settings.filters.set(settings.filters.TUTORIALS.SHOW_CODING, showCodingTutorials)
    }

    return {
      tutorials,
      courseFilter: 'all',
      showCodingTutorials: showCodingTutorials == null ? true : showCodingTutorials // default is true
    }
  },
  created: function () {
    if (this.$attrs.code === 'false') {
      this.trackEvent(EVENTS.FILTER, { filteredData: 'tutorials', filter: 'hideCodingTutorials', method: 'urlQuery' })
    }
  },
  methods: {
    capitalize: _.capitalize,
    processToggle: function () {
      this.showCodingTutorials = !this.showCodingTutorials

      if (!this.showCodingTutorials) {
        this.trackEvent(EVENTS.FILTER, { filteredData: 'tutorials', filter: 'hideCodingTutorials', method: 'toggle' })
      }

      settings.filters.set(settings.filters.TUTORIALS.SHOW_CODING, this.showCodingTutorials)

      // update query parameters
      // don't use this.$router.push/replace because it triggers a full re-render and does not preserve the scroll
      window.location.hash = window.location.hash.indexOf('?') === -1
        ? window.location.hash + `?code=${this.showCodingTutorials}`
        : window.location.hash.replace(`code=${!this.showCodingTutorials}`, `code=${this.showCodingTutorials}`)
    },
    trackEvent: function (event, opts = {}) {
      window.Countly.q.push(['add_event', {
        key: event,
        segmentation: {
          path: this.$route.path,
          ...opts
        }
      }])
    }
  }
}
</script>
