<template>
  <div>
    <Header/>
    <section class="center ph3 mw7">
      <h1 class="mt4">{{courseName}} Course</h1>

      <p class="f4 fw5 lh-copy ma0 pb4" data-cy="course-content-description" v-html="parse(courseDescription)"></p>
      <p class="f4 fw5 lh-copy ma0 pb4" data-cy="course-format-description">
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
      <div class="flex flex-wrap items-start mb5 mt4" >
        <ButtonLink
          v-for="course in otherCourses" :key="course.id"
          data-cy="all-tutorials"
          class="bg-navy white mb3 mr3"
          text="All Tutorials"
          :to="`/course/${course.id}`"
        >
          <ProjectIcon
            class="mr2"
            :id="course.id"
            :alt="`${course.name} project logo`"
            style="height: 1.5em;"
          />
          <span>{{course.name}} Course</span>
        </ButtonLink>
        <ButtonLink
          data-cy="all-tutorials"
          class="bg-navy white"
          text="All Tutorials"
          link="Tutorials"
        />
      </div>
    </section>
    <Footer/>
  </div>
</template>

<script>
import marked from 'marked'

import head from '../utils/head'
import tutorials, { correctedCases, getTutorialType } from '../utils/tutorials'
import { getCourseNames, getTutorialCount } from '../utils/courses'
import settings from '../utils/settings'
import { courseList, filterTutorials } from '../utils/filters'
import translations from '../static/translations'
import { getAll } from '../utils/projects'
import countly from '../utils/countly'

import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import TutorialsGrid from '../components/TutorialsGrid'
import ToggleButton from '../components/ToggleButton'
import ButtonLink from '../components/buttons/ButtonLink'
import ProjectIcon from '../components/icons/ProjectIcon'

export default {
  name: 'Tutorials',
  props: {
    courseUrl: String
  },
  components: {
    Header,
    Footer,
    TutorialsGrid,
    ToggleButton,
    ButtonLink,
    ProjectIcon
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
      return getAll().filter(course => course.id !== this.course && getCourseNames().includes(course.id)).sort((a, b) => getTutorialCount(b.id) - getTutorialCount(a.id))
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
      courseList,
      getCourseNames,
      showCodingTutorials: showCodingTutorials == null ? true : showCodingTutorials // default is true
    }
  },
  methods: {
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
    },
    parse (description) {
      return marked(description || '')
    }
  },
  head () {
    return this.course && head.dynamic.courses({ context: this })
  }
}
</script>
