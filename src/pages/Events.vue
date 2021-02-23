<template>
  <div>
    <Header current="Events"/>
    <section class="mw7 center ph3">
      <h1 class="mt4">Events</h1>
      <p class="f4 fw5 lh-copy ma0 pv3">
        Live ProtoSchool workshops around the globe offer you the
        opportunity to complete our interactive tutorials with the support of
        local mentors. Learn alongside fellow community members at a Meetup, conference, or independent event near you.
      </p>
      <ButtonLink
        class="mb2 mt3"
        link="Host"
      >
        Host an Event
      </ButtonLink>
      <h2>Upcoming Events</h2>
      <div v-if="futureEvents().length" class="flex flex-wrap justify-between events-list">
        <EventCard v-for="event in futureEvents()"
          v-bind="event"
          class="event-tile"
          :key="event.id"
          :future="true"
        />
      </div>
      <p class="f4 fw5 lh-copy ma0 pv3">
        <span v-if="futureEvents().length"> <strong>No workshops near you?</strong> Never fear! You </span>
        <span v-else><strong>More events coming soon!</strong> In the meantime, you </span>
        can <router-link to="/tutorials">explore our tutorials online</router-link> or learn how to <router-link to="/host">host local events</router-link>. If you know of an upcoming workshop not listed here, please ask the event organizer to <a href="https://forms.gle/t1iEzpQAFSYHhpBr9" target="_blank">submit it</a>.
      </p>
      <div v-if="pastEvents().length">
        <h2>Past Events
          <span v-if="viewAllPast || (pastEvents().length <= maxRedacted)">(All)</span>
          <span v-else>(Most Recent)</span>
        </h2>
        <div class="flex flex-wrap justify-between events-list">
          <EventCard v-for="event in pastEvents((viewAllPast ? null : maxRedacted))"
            v-bind="event"
            class="event-tile"
            :key="event.id"
            :future="false"
          />
        </div>
        <div v-if="!viewAllPast && (pastEvents().length > maxRedacted)" class="mv2">
          <span @click="togglePastEvents" tabindex="0" class="textLink chevron right" data-cy="view-solution">View Older Events</span>
        </div>
      </div>
    </section>
    <Footer/>
  </div>
</template>

<script>
import head from '../utils/head'
import { pastEvents, futureEvents } from '../utils/events'
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
import EventCard from '../components/cards/EventCard'
import ButtonLink from '../components/buttons/ButtonLink'

export default {
  name: 'events',
  components: {
    Header,
    Footer,
    EventCard,
    ButtonLink
  },
  data: self => {
    return {
      pastEvents,
      futureEvents,
      viewAllPast: false,
      maxRedacted: 4
    }
  },
  methods: {
    togglePastEvents: function () {
      this.viewAllPast = !this.viewAllPast
    }
  },
  head () {
    return head()
  }
}

</script>

<style>

.events-list {
  margin-left: -10px;
  margin-right: -10px;
}

.event-tile {
  flex-basis: calc(50% - 20px);
  margin: 10px;
}

.textLink:hover, .textLink:focus {
  font-weight: 700;
  cursor: pointer;
}

@media screen and (max-width: 750px) {
  .events {
    flex-wrap: nowrap;
    flex-direction: column;
  }

  .event-tile {
    flex-basis: 100%;
    max-width: 100%;
  }
}
</style>
