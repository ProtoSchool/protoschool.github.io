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
        <ButtonLink class="mb2 mr3" link="Tutorials">
          View All Tutorials
        </ButtonLink>
        <ButtonLink class="mb2" link="Build">
          Build a Tutorial
        </ButtonLink>
      </div>
      <h2 id="featured">Featured Tutorials</h2>
      <TutorialsGrid
        :tutorials="featuredTutorials"
      />
      <h2>Courses</h2>
      <p class="f4 fw5 lh-copy ma0 pb3">
        Interested in a specific distributed web protocol or storage network? Explore these curated collections of tutorials on projects including IPFS, Filecoin, and Multiformats.
      </p>
      <div class="flex flex-wrap items-start mb4 mt4" >
        <ButtonLink
          v-for="course in courses" :key="course.id"
          class="bg-navy white mb3 mr3"
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
      </div>
      <h2>Local Events</h2>
      <p class="f4 fw5 lh-copy ma0 pv3">
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
        <ButtonLink class="mb2 mr3" link="Events">
          View All Events
        </ButtonLink>
        <ButtonLink class="mb2" link="Host">
          Host an Event
        </ButtonLink>
      </div>
    <br>
    <h2>Video Tutorials</h2>
      <p class="f4 fw5 lh-copy ma0 pv3">
      Check this series of video tutorials that cover the entire stack of protocols for the decentralised web. The tutorials cover broad concepts and then go deep into protocol details too, so that you get a complete understanding of the system's operation.
      </p>
      <div class="mv3">
        <ButtonLink class="mb2 mr3" external link="https://research.protocol.ai/tutorials/resnetlab-on-tour/">
          View All Videos
        </ButtonLink>
      </div>
    </section>
    <Footer/>
  </div>
</template>

<script>
import head from '../utils/head'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import EventCard from '../components/cards/EventCard'
import ButtonLink from '../components/buttons/ButtonLink'
import TutorialsGrid from '../components/TutorialsGrid'
import ProjectIcon from '../components/icons/ProjectIcon'
import coursesList from '../static/courses.json'
import tutorials from '../utils/tutorials'
import { futureEvents } from '../utils/events'
import { getAll } from '../utils/projects'
import { getCourseNames, getTutorialCount } from '../utils/courses'

export default {
  name: 'Home',
  components: {
    Header,
    Footer,
    TutorialsGrid,
    EventCard,
    ButtonLink,
    ProjectIcon
  },
  data: self => {
    return {
      futureEvents,
      getTutorialCount
    }
  },
  computed: {
    featuredTutorials: () => coursesList.featured.map(tutorialId => ({ ...tutorials[tutorialId], tutorialId })),
    courses: () => getAll().filter(course => getCourseNames().includes(course.id)).sort((a, b) => getTutorialCount(b.id) - getTutorialCount(a.id))
  },
  head () {
    return head()
  }
}
</script>
