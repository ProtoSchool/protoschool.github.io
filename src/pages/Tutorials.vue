<template>
  <div>
    <Header/>
    <section class="center ph3 mw7">
      <h1 class="mt4">Interactive Tutorials</h1>
      <p class="f4 fw5 lh-copy ma0 pb4">
        Our self-guided interactive tutorials are designed to introduce you to decentralized web concepts, protocols, and tools. Select your topic and track your progress as you go, in a format that's right for you. Complete JavaScript code challenges right in your web browser or stick to our text-based or multiple-choice tutorials for a code-free experience. Our handy little icons will guide you to the content that fits your needs.</p>
      <div class="mw7 center w100 tr">
        <ToggleButton
            :value="showCoding"
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

    <template v-for="tutorial in (showCoding? allTutorials : codelessTutorials)" >
      <Tutorial :tutorial="tutorial" :key="tutorial.tutorialId" :tutorialId="tutorial.tutorialId" />
    </template>
  </div>
</template>

<script>
import coursesList from '../static/courses.json' // array of 4-digit tutorial IDs (strings)
import tutorialsList from '../static/tutorials.json' // object in which those 4-digit IDs are keys for tutorial objects
import { getTutorialType } from '../utils/tutorials'
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
    allTutorials: () => coursesList.all.map(tutorialId => ({ ...tutorialsList[tutorialId], tutorialId })),
    codelessTutorials: function () {
      return this.allTutorials.filter(tutorial => (getTutorialType(tutorial.tutorialId) !== 'code') && (getTutorialType(tutorial.tutorialId) !== 'file-upload'))
    }
  },
  data: self => {
    return {
      tutorialsList,
      showCoding: self.$route.query.code ? self.$route.query.code === 'true' : true
    }
  },
  created: function () {
    if (this.$attrs.code === 'false') {
      this.trackEvent(EVENTS.FILTER, { filteredData: 'tutorials', filter: 'hideCodingTutorials', method: 'urlQuery' })
    }
  },
  methods: {
    processToggle: function () {
      this.showCoding = !this.showCoding

      if (!this.showCoding) {
        this.trackEvent(EVENTS.FILTER, { filteredData: 'tutorials', filter: 'hideCodingTutorials', method: 'toggle' })
      }

      if (this.showCoding) {
        window.location.hash = window.location.hash.indexOf('?') === -1
          ? window.location.hash + '?code=true'
          : window.location.hash.replace('code=false', 'code=true')
      } else {
        window.location.hash = window.location.hash.indexOf('?') === -1
          ? window.location.hash + '?code=false'
          : window.location.hash.replace('code=true', 'code=false')
      }
    },
    trackEvent: function (event, opts = {}) {
      console.log('trackEvent.add_event', event, opts)
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
