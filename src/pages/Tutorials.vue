<template>
  <div>
    <Header/>
    <section class="center ph3 mw7">
      <h1 class="mt4">Interactive Tutorials</h1>
      <p class="f4 fw5 lh-copy ma0 pb4">
        Our self-guided interactive tutorials are designed to introduce you to decentralized web concepts, protocols, and tools. Select your topic and track your progress as you go, in a format that's right for you. Complete JavaScript code challenges right in your web browser or stick to our text-based or multiple-choice tutorials for a code-free experience. Our handy little icons will guide you to the content that fits your needs.</p>
      <div class="mw7 center w100 tr mb4 flex items-center-ns flex-row-ns flex-column justify-between items-start">
        <SelectInput
          id="course-select"
          name="course"
          v-model="courseFilter"
          :options="courseList"
          label="Courses"
          class="mr4 mb0-ns mb3"
          data-cy="course-select"
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
      <TutorialsGrid
        :tutorials="filteredTutorials"
      />
    </section>
    <Footer/>
  </div>
</template>

<script>
import head from '../utils/head'
import tutorials from '../utils/tutorials'
import settings from '../utils/settings'
import { courseList, filterTutorials } from '../utils/filters'

import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import SelectInput from '../components/forms/inputs/SelectInput.vue'
import TutorialsGrid from '../components/TutorialsGrid.vue'
import ToggleButton from '../components/ToggleButton.vue' // adapted locally from npm package 'vue-js-toggle-button'
import countly from '../utils/countly'

export default {
  name: 'Tutorials',
  components: {
    Header,
    Footer,
    TutorialsGrid,
    ToggleButton,
    SelectInput
  },
  computed: {
    filteredTutorials: function () {
      return filterTutorials(this.courseFilter, this.showCodingTutorials)
    },
    trackingData: function () {
      return {
        path: this.$route.path
      }
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
      courseFilter: courseList.find(course => course.key === self.$route.query.course) || courseList.find(course => course.key === 'all'),
      showCodingTutorials: showCodingTutorials == null ? true : showCodingTutorials // default is true
    }
  },
  created: function () {
    if (this.$attrs.code === 'false') {
      countly.trackEvent(countly.events.FILTER, {
        ...this.trackingData,
        filteredData: 'tutorials',
        filter: 'hideCodingTutorials',
        method: 'urlQuery'
      })
    }
    if (this.$attrs.course && this.$attrs.course !== 'all') {
      countly.trackEvent(countly.events.FILTER, {
        ...this.trackingData,
        filteredData: 'courses',
        filter: this.$attrs.course,
        method: 'urlQuery'
      })
    }
  },
  watch: {
    courseFilter: function (value) {
      if (value.key !== 'all') {
        countly.trackEvent(countly.events.FILTER, {
          ...this.trackingData,
          filteredData: 'courses',
          filter: value.key,
          method: 'select'
        })
      }

      this.setQueryParameter('course', value.key)
    }
  },
  methods: {
    setQueryParameter: function (name, value) {
      const scrollPosition = window.pageYOffset

      // In order to always have the same order of the parameters in the url,
      // we need to sort the keys of the query object, and then create the object
      this.$router.push({
        query: Object.keys(this.$route.query).concat([name]).sort().reduce((query, key) => {
          query[key] = key === name ? value : this.$route.query[key]

          return query
        }, {})
      })

      // fix for vue-router: do not scroll to top on location.search change
      setTimeout(() => window.scrollTo(0, scrollPosition), 0)
    },
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
      this.setQueryParameter('code', this.showCodingTutorials)
    }
  },
  head () {
    return head()
  }
}
</script>
