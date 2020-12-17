<template>
  <div>
    <Header/>
    <section class="center ph3 mw7">
      <h1 class="mt4">{{courseName}} Course</h1>

      <p class="f4 fw5 lh-copy ma0 pb4">{{courseDescription}}</p>
      <p class="f4 fw5 lh-copy ma0 pb4">
        ProtoSchool's self-guided interactive tutorials are designed to introduce you to decentralized web concepts, protocols, and tools.
        <span v-if="hasCodingTutorials">This course on {{courseName}} includes both JavaScript code challenges and code-free tutorials with text-based lessons and  multiple-choice quizzes. Our handy little icons will guide you to the content that fits your needs. </span>
        <span v-else>The tutorials in this course on {{courseName}} offer a code-free experience with text-based lessons and multiple-choice quizzes. </span>
        We recommend proceeding through the tutorials in the order in which they're presented.
      </p>

      <div class="mw7 center w100 tr mb4 flex flex-row justify-end">
        <ToggleButton
            v-if="hasCodingTutorials"
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

      <TutorialsGrid
        :tutorials="filteredTutorials"
      />
      <h2>More Content to Explore</h2>
      <!-- <p>{{get(course.key).logo}}</p> -->
      <div class="course-list mb5" >
        <router-link v-for="course in otherCourses" :key="course.key" class="f5 link dim br-pill ph3 pv2 mb2 dib white bg-navy mr3"
        :to="`/course/${course.key}`">
          <!-- <img
            class="mr2"
            :src="`${get(course.key).logo}`"
            :alt="`${course.name} project logo`"
            style="height: 23px"
          /> -->
          <span>{{course.name}} Course</span>
        </router-link>
        <router-link class="f5 link dim br-pill ph3 pv2 mb2 dib white bg-navy mr3" to="/tutorials">All Tutorials</router-link>
      </div>
    </section>
  </div>
</template>

<script>
import _ from 'lodash'
import head from '../utils/head'
import tutorials, { correctedCases, getTutorialType } from '../utils/tutorials'
import { getCourseNames } from '../utils/courses'
import settings from '../utils/settings'
import { courseList, filterTutorials } from '../utils/filters'
import translations from '../static/translations'
// import { get } from '../utils/projects'

import Header from '../components/Header.vue'
import TutorialsGrid from '../components/TutorialsGrid.vue'
import ToggleButton from '../components/ToggleButton.vue' // adapted locally from npm package 'vue-js-toggle-button'
import countly from '../utils/countly'

export default {
  name: 'Tutorials',
  props: {
    courseUrl: String
  },
  components: {
    Header,
    TutorialsGrid,
    ToggleButton
  },
  computed: {
    course: function () {
      const course = this.courseUrl

      // If courseUrl is not valid, redirect to 404 page
      if (!getCourseNames().includes(course)) {
        this.$router.replace({ name: '404' })

        return null
      }

      return course
    },
    filteredTutorials: function () {
      return filterTutorials(this.courseFilter, this.showCodingTutorials)
    },
    trackingData: function () {
      return {
        path: this.$route.path
      }
    },
    courseName: function () {
      return this.course.split('-').map(word => (
        correctedCases[word] ? correctedCases[word] : (word.charAt(0).toUpperCase() + word.slice(1))
      )).join(' ')
    },
    courseFilter: function () {
      return courseList.find(course => course.key === this.course)
    },
    hasCodingTutorials: function () {
      return this.courseFilter.tutorials.some(tutorialId => getTutorialType(tutorialId) === 'code' || getTutorialType(tutorialId) === 'file-upload')
    },
    courseDescription: function () {
      return translations.courses[this.course].description
    },
    seoDescription: function () {
      return translations.courses[this.course].seoDescription
    },
    otherCourses: function () {
      return courseList.filter(courseObject => courseObject.key !== this.course && courseObject.key !== 'all')
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
      // courseFilter format example: { "key": "ipfs", "name": "IPFS", "count": 6, "tutorials": [ "0001", "0004", "0005", "0002", "0003", "0006" ] }
      courseList,
      getCourseNames,
      showCodingTutorials: showCodingTutorials == null ? true : showCodingTutorials // default is true
    }
  },
  methods: {
    capitalize: _.capitalize,

    processToggle: function () {
      this.showCodingTutorials = !this.showCodingTutorials

      if (!this.showCodingTutorials) {
        countly.trackEvent(countly.events.FILTER, {
          ...this.trackingData,
          filteredData: 'tutorials',
          filter: 'hideCodingTutorials',
          method: 'toggle'
        })
      }

      settings.filters.set(settings.filters.TUTORIALS.SHOW_CODING, this.showCodingTutorials)
    }
  },
  head () {
    return this.course && head.dynamic.courses({ context: this })
  }
}
</script>
