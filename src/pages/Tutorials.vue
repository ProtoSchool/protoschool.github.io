<template>
  <div>
    <Header/>
    <section class="center ph3 mw7">
      <h1 class="mt4">Interactive Tutorials</h1>
      <p class="f4 fw5 lh-copy ma0 pb4">
        Our self-guided interactive tutorials are designed to introduce you to decentralized web concepts, protocols, and tools. Select your topic and track your progress as you go, in a format that's right for you. Complete JavaScript code challenges right in your web browser or stick to our text-based or multiple-choice tutorials for a code-free experience. Our handy little icons will guide you to the content that fits your needs.</p>
      <div class="mw7 center w100 tr mb3 flex items-center-ns flex-row-ns flex-column justify-between items-start">
        <SelectInput
          id="course-select"
          name="course"
          v-model="courseFilter"
          :options="courses"
          label="Courses"
          class="mr4 mb0-ns mb3"
        />
        <ToggleButton
            :value="showCodingTutorials"
            sync
            color="#69c4cd"
            :width="40"
            :name="'includeCodingTutorials'"
            :id="'includeCodingTutorials'"
            :label="'Include Coding Tutorials'"
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
import qs from 'querystringify'
import coursesList from '../static/courses.json'
import tutorials, { getTutorialType, correctedCases } from '../utils/tutorials'
import settings from '../utils/settings'

import Header from '../components/Header.vue'
import SelectInput from '../components/forms/inputs/SelectInput.vue'
import Tutorial from '../components/Tutorial.vue'
import ToggleButton from '../components/ToggleButton.vue' // adapted locally from npm package 'vue-js-toggle-button'
import { EVENTS } from '../static/countly'

let courses = {}
let standardCourses = _.omit(coursesList, ['featured'])
for (const course in standardCourses) {
  courses[course] = {
    key: course,
    name: correctedCases[course] || _.capitalize(course),
    count: coursesList[course].length
  }
}

export default {
  name: 'Tutorials',
  components: {
    Header,
    Tutorial,
    ToggleButton,
    SelectInput
  },
  computed: {
    filteredTutorials: function () {
      return coursesList[this.courseFilter.key].map(tutorialId => ({ ...tutorials[tutorialId], tutorialId }))
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
      courses,
      courseFilter: coursesList[self.$route.query.course] ? courses[self.$route.query.course] : courses.all,
      showCodingTutorials: showCodingTutorials == null ? true : showCodingTutorials // default is true
    }
  },
  created: function () {
    if (this.$attrs.code === 'false') {
      this.trackEvent(EVENTS.FILTER, { filteredData: 'tutorials', filter: 'hideCodingTutorials', method: 'urlQuery' })
    }
    if (this.$attrs.course !== 'all') {
      this.trackEvent(EVENTS.FILTER, { filteredData: 'courses', filter: `${this.$attrs.course}`, method: 'urlQuery' })
    }
  },
  watch: {
    courseFilter: function (value) {
      if (value.key !== 'all') {
        this.trackEvent(EVENTS.FILTER, { filteredData: 'courses', filter: `${value.key}`, method: 'select' })
      }
      this.setQueryParameter('course', value.key)
    }
  },
  methods: {
    setQueryParameter: function (name, value) {
      const queries = {
        ...this.$route.query,
        [name]: value
      }
      const queryString = qs.stringify(queries)

      // update query parameters
      // don't use this.$router.push/replace because it triggers a full re-render and does not preserve the scroll
      window.location.hash = window.location.hash.indexOf('?') === -1
        ? window.location.hash + '?' + queryString
        : window.location.hash.replace(window.location.hash.split('?')[1], queryString)
    },
    capitalize: _.capitalize,
    processToggle: function () {
      this.showCodingTutorials = !this.showCodingTutorials

      if (!this.showCodingTutorials) {
        this.trackEvent(EVENTS.FILTER, { filteredData: 'tutorials', filter: 'hideCodingTutorials', method: 'toggle' })
      }
      settings.filters.set(settings.filters.TUTORIALS.SHOW_CODING, this.showCodingTutorials)
      this.setQueryParameter('code', this.showCodingTutorials)
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
