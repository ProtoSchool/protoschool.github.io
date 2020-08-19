<template>
  <div>
    <Header current="Home"/>
    <section class="mw7 center ph3">
      <h1 class="mt4">Interactive Tutorials</h1>
      <p class="f4 fw5 lh-copy ma0 pb3">
      Our self-guided interactive tutorials are designed to introduce you to
      decentralized web concepts, protocols, and tools. Select your topic and
      track your progress as you go, in a format that's right for you. Complete
      JavaScript code challenges right in your web browser or stick to our text-based
      or multiple-choice tutorials for a code-free experience.</p>
      <div>
        <router-link class="f5 link dim br-pill ph3 pv2 mb2 dib white bg-navy mr3" to="/tutorials">View All Tutorials</router-link>
        <router-link class="f5 link dim br-pill ph3 pv2 mb2 dib white bg-navy" to="/build">Build a Tutorial</router-link>
      </div>
      <h2 id="featured">Featured Tutorials</h2>
      <TutorialsGrid
        :tutorials="featuredTutorials"
      />
      <h2>Local Events</h2>
      <p class="f4 fw5 lh-copy ma0 pv3  ">
      Groups and individuals around the world host in-person events using our tutorials
      as curriculum, with mentors available to help you work through the challenges.
      </p>
      <div v-if="futureEvents().length">
        <h2>Coming Soon</h2>
        <div class="flex flex-wrap justify-between events-list">
          <EventCard v-for="event in futureEvents(4)"
            v-bind="event"
            class="event-tile"
            :key="event.id"
            :future="true"
          />
        </div>
      </div>
      <div class="mv3">
        <router-link class="f5 link dim br-pill ph3 pv2 mb2 dib white bg-navy mr3" to="/events">View All Events</router-link>
        <router-link class="f5 link dim br-pill ph3 pv2 mb2 dib white bg-navy" to="/host">Host an Event</router-link>
      </div>
    </section>
  </div>
</template>

<script>
import head from '../utils/head'
import Header from '../components/Header'
import EventCard from '../components/cards/EventCard'
import TutorialsGrid from '../components/TutorialsGrid.vue'
import coursesList from '../static/courses.json'
import tutorials from '../utils/tutorials'
import { futureEvents } from '../utils/events'

export default {
  name: 'Home',
  components: {
    Header,
    TutorialsGrid,
    EventCard
  },
  data: self => {
    return {
      futureEvents
    }
  },
  computed: {
    featuredTutorials: () => coursesList.featured.map(tutorialId => ({ ...tutorials[tutorialId], tutorialId }))
  },
  head: head()
}
</script>
